/*
================================================================
 STORED PROCEDURE: RESTORE LOCATION (KHÔI PHỤC ĐỊA ĐIỂM)
================================================================
*/

USE VIVUVIET;
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_restore_location$$

CREATE PROCEDURE sp_restore_location(
    IN p_locID INT,
    IN p_ownerID INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(500)
)
BEGIN
    DECLARE current_owner INT;
    DECLARE current_status VARCHAR(50);
    
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
        SET p_message = 'Lỗi: Bạn không có quyền khôi phục địa điểm này.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Không có quyền.';
    END IF;
    
    -- Check if already active
    IF current_status = 'ACTIVE' THEN
        SET p_message = 'Lỗi: Địa điểm này đang hoạt động, không cần khôi phục.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Đã active rồi.';
    END IF;
    
    -- Check if not INACTIVE (e.g., PENDING)
    IF current_status != 'INACTIVE' THEN
        SET p_message = 'Lỗi: Chỉ có thể khôi phục các địa điểm đã bị vô hiệu hóa.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Status không hợp lệ.';
    END IF;
    
    -- Restore: Set status back to ACTIVE
    UPDATE LOCATION
    SET status = 'ACTIVE'
    WHERE locID = p_locID;
    
    SET p_success = TRUE;
    SET p_message = 'Khôi phục địa điểm thành công!';
END$$

DELIMITER ;

SELECT 'Stored procedure sp_restore_location created successfully!' as message;
