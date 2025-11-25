/*
================================================================
 STORED PROCEDURE: HARD DELETE LOCATION (XÓA VĨNH VIỄN)
================================================================
 Chỉ xóa được những location đã ở trạng thái INACTIVE
 (đã soft delete trước đó)
*/

USE VIVUVIET;
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_hard_delete_location$$

CREATE PROCEDURE sp_hard_delete_location(
    IN p_locID INT,
    IN p_ownerID INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(500)
)
BEGIN
    DECLARE current_owner INT;
    DECLARE current_status VARCHAR(50);
    DECLARE has_completed_bookings INT;
    
    SET p_success = FALSE;
    
    -- Check if location exists
    SELECT ownerID, status INTO current_owner, current_status
    FROM LOCATION
    WHERE locID = p_locID;
    
    IF current_owner IS NULL THEN
        SET p_message = 'Lỗi: Không tìm thấy địa điểm với ID này.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Location không tồn tại.';
    END IF;
    
    -- Check ownership
    IF current_owner != p_ownerID THEN
        SET p_message = 'Lỗi: Bạn không có quyền xóa địa điểm này.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Không có quyền.';
    END IF;
    
    -- IMPORTANT: Can only hard delete INACTIVE locations
    IF current_status != 'INACTIVE' THEN
        SET p_message = 'Lỗi: Chỉ có thể xóa vĩnh viễn các địa điểm đã vô hiệu hóa (INACTIVE). Vui lòng xóa mềm trước.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Location phải INACTIVE.';
    END IF;
    
    -- Check if has completed bookings (business rule: keep history)
    SELECT COUNT(*) INTO has_completed_bookings
    FROM RESERVATION R
    JOIN BOOKING_DETAILS BD ON R.reservationID = BD.reservationID
    JOIN LOCATION_HAS_PRODUCT LHP ON BD.productID = LHP.productID
    WHERE LHP.locID = p_locID
      AND R.status = 'COMPLETED';
    
    IF has_completed_bookings > 0 THEN
        SET p_message = 'Cảnh báo: Địa điểm này có lịch sử giao dịch đã hoàn thành. Khuyến nghị không xóa vĩnh viễn để giữ tính toàn vẹn dữ liệu. Bạn vẫn muốn tiếp tục?';
        -- Không SIGNAL error, chỉ warning trong message
        -- Frontend sẽ hiển thị confirmation dialog
    END IF;
    
    -- ================================================================
    -- HARD DELETE: Remove all related records then delete location
    -- ================================================================
    
    -- 1. Delete feedback (reviews & comments)
    DELETE FROM COMMENT WHERE commentID IN (
        SELECT fbID FROM FEEDBACK WHERE locID = p_locID
    );
    
    DELETE FROM REVIEW WHERE reviewID IN (
        SELECT fbID FROM FEEDBACK WHERE locID = p_locID
    );
    
    DELETE FROM FB_HAS_IMAGE WHERE fbID IN (
        SELECT fbID FROM FEEDBACK WHERE locID = p_locID
    );
    
    DELETE FROM FEEDBACK WHERE locID = p_locID;
    
    -- 2. Delete location relationships
    DELETE FROM LOCATION_HAS_PREFERENCE WHERE locID = p_locID;
    DELETE FROM LOC_HAS_UTILITY WHERE locID = p_locID;
    DELETE FROM LOC_HAS_IMAGE WHERE locID = p_locID;
    
    -- 3. Delete products (CASCADE will handle LOCATION_HAS_PRODUCT)
    DELETE LHP FROM LOCATION_HAS_PRODUCT LHP
    WHERE LHP.locID = p_locID;
    
    -- 4. Delete specialized location records
    DELETE FROM HOTEL WHERE hotelID = p_locID;
    DELETE FROM RESTAURANT WHERE restaurantID = p_locID;
    DELETE FROM ENTERTAINMENT_VENUE WHERE EVID = p_locID;
    DELETE FROM ENTERTAINMENT_VENUE_DUE WHERE EVID = p_locID;
    DELETE FROM LOCATION_OPENING_HOURS WHERE locID = p_locID;
    
    -- 5. Finally, delete the location itself
    DELETE FROM LOCATION WHERE locID = p_locID;
    
    SET p_success = TRUE;
    SET p_message = 'Đã xóa vĩnh viễn địa điểm khỏi hệ thống!';
END$$

DELIMITER ;

SELECT 'Stored procedure sp_hard_delete_location created successfully!' as message;
SELECT 'CẢNH BÁO: Thủ tục này XÓA VĨNH VIỄN dữ liệu. Chỉ dùng cho locations INACTIVE.' as warning;
