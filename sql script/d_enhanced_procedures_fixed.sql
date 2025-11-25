/*
================================================================
 VIVUVIET - FIXED STORED PROCEDURES FOR BACKEND
 Fixed to match exact parameter order and OUT parameters from index_with_sp.js
================================================================
*/

USE VIVUVIET;
DELIMITER $$

-- ================================================================
-- 1. FIX sp_add_location - Match backend parameter order
-- Backend calls: CALL sp_add_location(ownerID, locName, locNo, street, ward, district, province, locType, description, priceLev, @newID, @success, @msg)
-- ================================================================
DROP PROCEDURE IF EXISTS sp_add_location$$
CREATE PROCEDURE sp_add_location(
    IN p_ownerID INT,
    IN p_locName VARCHAR(255),
    IN p_locNo VARCHAR(50),
    IN p_street VARCHAR(255),
    IN p_ward VARCHAR(100),
    IN p_district VARCHAR(100),
    IN p_province VARCHAR(100),
    IN p_locType VARCHAR(50),
    IN p_description TEXT,
    IN p_priceLev VARCHAR(50),
    OUT p_newID INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(500)
)
BEGIN
    DECLARE owner_role VARCHAR(50);
    DECLARE owner_status VARCHAR(50);
    
    -- Initialize OUT parameters
    SET p_success = FALSE;
    SET p_newID = NULL;

    -- 1. Validate required fields
    IF p_locName IS NULL OR TRIM(p_locName) = '' THEN
        SET p_message = 'Lỗi: Tên địa điểm không được để trống.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Tên địa điểm không được để trống.';
    END IF;

    IF p_street IS NULL OR TRIM(p_street) = '' THEN
        SET p_message = 'Lỗi: Tên đường/phố là bắt buộc.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Tên đường/phố là bắt buộc.';
    END IF;

    IF p_district IS NULL OR TRIM(p_district) = '' THEN
        SET p_message = 'Lỗi: Quận/huyện là bắt buộc.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Quận/huyện là bắt buộc.';
    END IF;

    IF p_province IS NULL OR TRIM(p_province) = '' THEN
        SET p_message = 'Lỗi: Tỉnh/thành phố là bắt buộc.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Tỉnh/thành phố là bắt buộc.';
    END IF;

    -- 2. Check if location name already exists
    IF EXISTS (SELECT 1 FROM LOCATION WHERE locName = p_locName) THEN
        SET p_message = 'Lỗi: Tên địa điểm đã tồn tại. Vui lòng chọn tên khác.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Tên địa điểm đã tồn tại.';
    END IF;

    -- 3. Validate location type
    IF p_locType NOT IN ('HOTEL', 'RESTAURANT', 'VENUE') THEN
        SET p_message = 'Lỗi: Loại địa điểm phải là HOTEL, RESTAURANT hoặc VENUE.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Loại địa điểm không hợp lệ.';
    END IF;

    -- 4. Validate price level if provided
    IF p_priceLev IS NOT NULL AND p_priceLev NOT IN ('BUDGET', 'MODERATE', 'UPSCALE', 'LUXURY') THEN
        SET p_message = 'Lỗi: Mức giá phải là: Bình dân, Trung bình, Cao cấp hoặc Xa xỉ.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Mức giá không hợp lệ.';
    END IF;








    -- 5. Validate owner exists and is verified
    SELECT U.role, B.auStatus INTO owner_role, owner_status
    FROM USER_ACCOUNT U
    JOIN BUSINESS_OWNER B ON U.userID = B.BOID
    WHERE U.userID = p_ownerID;

    IF owner_role IS NULL THEN
        SET p_message = 'Lỗi: Chủ sở hữu (ownerID) không tồn tại.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Owner không tồn tại.';
    ELSEIF owner_role != 'OWNER' THEN
        SET p_message = 'Lỗi: UserID này không có vai trò là OWNER.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Không phải OWNER.';
    ELSEIF owner_status != 'VERIFIED' THEN
        SET p_message = 'Lỗi: Tài khoản chủ sở hữu chưa được xác thực.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Owner chưa verify.';
    END IF;

    -- 6. Execute INSERT
    INSERT INTO LOCATION (
        locName, street, district, province, locType, ownerID, 
        locNo, ward, priceLev, description, status, ratingPoints, hotnessScore
    ) VALUES (
        p_locName, p_street, p_district, p_province, p_locType, p_ownerID,
        p_locNo, p_ward, p_priceLev, p_description, 'ACTIVE', 0, 0
    );
    
    SET p_newID = LAST_INSERT_ID();
    SET p_success = TRUE;
    SET p_message = 'Thêm địa điểm thành công!';
END$$

-- ================================================================
-- 2. FIX sp_update_location - Match backend parameter order
-- Backend calls: CALL sp_update_location(locID, locName, street, district, province, description, priceLev, status, @success, @msg)
-- ================================================================
DROP PROCEDURE IF EXISTS sp_update_location$$
CREATE PROCEDURE sp_update_location(
    IN p_locID INT,
    IN p_locName VARCHAR(255),
    IN p_street VARCHAR(255),
    IN p_district VARCHAR(100),
    IN p_province VARCHAR(100),
    IN p_description TEXT,
    IN p_priceLev VARCHAR(50),
    IN p_status VARCHAR(50),
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(500)
)
BEGIN
    DECLARE location_exists INT;
    
    SET p_success = FALSE;
    
    -- Check if location exists
    SELECT COUNT(*) INTO location_exists
    FROM LOCATION
    WHERE locID = p_locID;
    
    IF location_exists = 0 THEN
        SET p_message = 'Lỗi: Không tìm thấy địa điểm với ID này.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Location không tồn tại.';
    END IF;
    
    -- Validate new location name if provided (must be unique)
    IF p_locName IS NOT NULL AND p_locName != '' THEN
        IF EXISTS (SELECT 1 FROM LOCATION WHERE locName = p_locName AND locID != p_locID) THEN
            SET p_message = 'Lỗi: Tên địa điểm đã tồn tại. Vui lòng chọn tên khác.';
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Tên trùng.';
        END IF;
    END IF;
    
    -- Validate price level if provided
    IF p_priceLev IS NOT NULL AND p_priceLev NOT IN ('Bình dân', 'Trung bình', 'Cao cấp', 'Xa xỉ') THEN
        SET p_message = 'Lỗi: Mức giá phải là: Bình dân, Trung bình, Cao cấp hoặc Xa xỉ.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Mức giá không hợp lệ.';
    END IF;
    
    -- Execute UPDATE (only update non-NULL values)
    UPDATE LOCATION
    SET 
        locName = COALESCE(NULLIF(p_locName, ''), locName),
        street = COALESCE(NULLIF(p_street, ''), street),
        district = COALESCE(NULLIF(p_district, ''), district),
        province = COALESCE(NULLIF(p_province, ''), province),
        priceLev = COALESCE(p_priceLev, priceLev),
        description = COALESCE(p_description, description),
        status = COALESCE(p_status, status)
    WHERE locID = p_locID;
    
    SET p_success = TRUE;
    SET p_message = 'Cập nhật địa điểm thành công!';
END$$

-- ================================================================
-- 3. FIX sp_delete_location - Add OUT parameters
-- Backend calls: CALL sp_delete_location(locID, ownerID, @success, @msg)
-- ================================================================
DROP PROCEDURE IF EXISTS sp_delete_location$$
CREATE PROCEDURE sp_delete_location(
    IN p_locID INT,
    IN p_ownerID INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(500)
)
BEGIN
    DECLARE current_owner INT;
    DECLARE pending_booking_count INT;
    
    SET p_success = FALSE;
    
    -- Verify ownership
    SELECT ownerID INTO current_owner
    FROM LOCATION
    WHERE locID = p_locID;
    
    IF current_owner IS NULL THEN
        SET p_message = 'Lỗi: Không tìm thấy địa điểm với ID này.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Location không tồn tại.';
    END IF;
    
    IF current_owner != p_ownerID THEN
        SET p_message = 'Lỗi: Bạn không có quyền xóa địa điểm này.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Không có quyền.';
    END IF;
    
    -- Check for pending/confirmed reservations
    SELECT COUNT(*) INTO pending_booking_count
    FROM RESERVATION R
    JOIN BOOKING_DETAILS BD ON R.reservationID = BD.reservationID
    JOIN LOCATION_HAS_PRODUCT LHP ON BD.productID = LHP.productID
    WHERE LHP.locID = p_locID
      AND R.status IN ('PENDING', 'CONFIRMED');
    
    IF pending_booking_count > 0 THEN
        SET p_message = 'Lỗi: Không thể xóa địa điểm đang có đơn đặt chỗ đang xử lý.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Còn booking pending.';
    END IF;
    
    -- Soft delete: Set status to INACTIVE
    UPDATE LOCATION
    SET status = 'INACTIVE'
    WHERE locID = p_locID;
    
    SET p_success = TRUE;
    SET p_message = 'Đã vô hiệu hóa địa điểm thành công!';
END$$

-- ================================================================
-- 4. FIX sp_get_locations_by_owner - Match backend parameter order
-- Backend calls: CALL sp_get_locations_by_owner(ownerID, search, locType, status, sortBy)
-- ================================================================
DROP PROCEDURE IF EXISTS sp_get_locations_by_owner$$
CREATE PROCEDURE sp_get_locations_by_owner(
    IN p_ownerID INT,
    IN p_searchQuery VARCHAR(255),
    IN p_typeFilter VARCHAR(50),
    IN p_statusFilter VARCHAR(50),
    IN p_sortBy VARCHAR(50)
)
BEGIN
    -- Default sortBy
    SET p_sortBy = COALESCE(p_sortBy, 'name');
    
    SELECT 
        L.locID,
        L.locName,
        L.locType,
        L.street,
        L.district,
        L.province,
        L.priceLev,
        L.status,
        L.ratingPoints,
        L.hotnessScore,
        L.description,
        L.locNo,
        L.ward
    FROM LOCATION L
    WHERE L.ownerID = p_ownerID
      AND (p_statusFilter IS NULL OR L.status = p_statusFilter)
      AND (p_typeFilter IS NULL OR L.locType = p_typeFilter)
      AND (p_searchQuery IS NULL OR 
           L.locName LIKE CONCAT('%', p_searchQuery, '%') OR
           L.district LIKE CONCAT('%', p_searchQuery, '%') OR
           L.province LIKE CONCAT('%', p_searchQuery, '%'))
    ORDER BY 
        CASE WHEN p_sortBy = 'name' THEN L.locName END ASC,
        CASE WHEN p_sortBy = 'province' THEN L.province END ASC,
        CASE WHEN p_sortBy = 'rating' THEN L.ratingPoints END DESC,
        L.locID DESC;
END$$

-- ================================================================
-- 5. FIX sp_get_owner_statistics - Make extra params optional
-- Backend calls: CALL sp_get_owner_statistics(ownerID)
-- ================================================================
DROP PROCEDURE IF EXISTS sp_get_owner_statistics$$
CREATE PROCEDURE sp_get_owner_statistics(
    IN p_ownerID INT
)
BEGIN
    SELECT
        L.locID,
        L.locName,
        L.locType,
        L.priceLev,
        L.ratingPoints,
        L.status,
        COUNT(DISTINCT CASE WHEN R.status = 'COMPLETED' THEN R.reservationID END) as totalCompletedBookings,
        COUNT(DISTINCT CASE WHEN R.status IN ('PENDING', 'CONFIRMED') THEN R.reservationID END) as pendingBookings,
        COALESCE(SUM(CASE WHEN T.status = 'COMPLETED' THEN T.paidAmount ELSE 0 END), 0) as totalRevenue,
        -- Chỉ tính avg rating cho locations ACTIVE và có ít nhất 1 review
        CASE 
            WHEN L.status = 'ACTIVE' AND COUNT(DISTINCT RV.reviewID) > 0 
            THEN COALESCE(AVG(RV.ratingPoints), 0)
            ELSE 0
        END as averageRating,
        COUNT(DISTINCT F.fbID) as totalReviews
    FROM LOCATION L
    LEFT JOIN LOCATION_HAS_PRODUCT LHP ON L.locID = LHP.locID
    LEFT JOIN BOOKING_DETAILS BD ON LHP.productID = BD.productID
    LEFT JOIN RESERVATION R ON BD.reservationID = R.reservationID
    LEFT JOIN `TRANSACTION` T ON R.reservationID = T.reservationID
    LEFT JOIN FEEDBACK F ON L.locID = F.locID AND F.feedbackType = 'REVIEW'
    LEFT JOIN REVIEW RV ON F.fbID = RV.reviewID
    WHERE L.ownerID = p_ownerID
    GROUP BY L.locID, L.locName, L.locType, L.priceLev, L.ratingPoints, L.status
    ORDER BY totalRevenue DESC, averageRating DESC;
END$$

DELIMITER ;

-- ================================================================
-- SUCCESS MESSAGE
-- ================================================================
SELECT 'Fixed stored procedures created successfully!' as message;
SELECT 'Run this file to replace old procedures with backend-compatible versions.' as note;
