/*
================================================================
 VIVUVIET - COMPREHENSIVE SQL PROCEDURES, FUNCTIONS & TRIGGERS
================================================================
 BTL2 Requirements Implementation:
 - 2.1: LOCATION CRUD Procedures (sp_add_location, sp_update_location, sp_delete_location, sp_get_locations_by_owner)
 - 2.2: Constraints & Triggers (all business logic triggers)
 - 2.3: Additional Procedures (search, statistics, preference updates)
 - 2.4: Functions with CURSOR+LOOP, IF+QUERY examples
================================================================
*/

USE VIVUVIET;
DELIMITER $$

/* ================================================================
   PART 1: HELPER FUNCTIONS (BTL 2.4 - Functions with CURSOR, LOOP, IF)
   ================================================================ */

-- Function 1.1: Calculate Reservation Total (CURSOR + LOOP Example)
DROP FUNCTION IF EXISTS fn_calculate_reservation_total$$
CREATE FUNCTION fn_calculate_reservation_total(
    p_reservationID INT
)
RETURNS DECIMAL(18, 2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total_amount DECIMAL(18, 2) DEFAULT 0;
    DECLARE item_quantity INT;
    DECLARE item_price DECIMAL(18, 2);
    DECLARE done INT DEFAULT FALSE;

    -- Declare CURSOR to iterate through booking details
    DECLARE details_cursor CURSOR FOR
        SELECT quantity, unitPrice
        FROM BOOKING_DETAILS
        WHERE reservationID = p_reservationID;
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    IF p_reservationID IS NULL THEN
        RETURN 0;
    END IF;
    
    OPEN details_cursor;

    -- LOOP through each booking item
    read_loop: LOOP
        FETCH details_cursor INTO item_quantity, item_price;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        SET total_amount = total_amount + (item_quantity * item_price);
    END LOOP;

    CLOSE details_cursor;
    RETURN total_amount;
END$$

-- Function 1.2: Get Tourist Rank (IF + QUERY Example)
DROP FUNCTION IF EXISTS fn_get_tourist_rank$$
CREATE FUNCTION fn_get_tourist_rank(
    p_touristID INT
)
RETURNS VARCHAR(50)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total_spent DECIMAL(18, 2);
    DECLARE user_rank VARCHAR(50);

    -- Validate Input
    IF p_touristID IS NULL THEN
        RETURN 'Invalid';
    END IF;

    -- Query Data
    SELECT totalSpent INTO total_spent
    FROM TOURIST
    WHERE touristID = p_touristID;

    IF total_spent IS NULL THEN
        RETURN 'Bronze'; -- Default
    END IF;

    -- Use IF statement to determine rank
    IF total_spent >= 50000000 THEN
        SET user_rank = 'Diamond';
    ELSEIF total_spent >= 20000000 THEN
        SET user_rank = 'Platinum';
    ELSEIF total_spent >= 10000000 THEN
        SET user_rank = 'Gold';
    ELSEIF total_spent >= 5000000 THEN
        SET user_rank = 'Silver';
    ELSE
        SET user_rank = 'Bronze';
    END IF;

    RETURN user_rank;
END$$

-- Function 1.3: Calculate Discount Amount
DROP FUNCTION IF EXISTS fn_calculate_discount$$
CREATE FUNCTION fn_calculate_discount(
    p_totalAmount DECIMAL(18, 2),
    p_voucherID INT
)
RETURNS DECIMAL(18, 2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE discount_percent FLOAT;
    DECLARE max_limit_val DECIMAL(18, 2);
    DECLARE calculated_discount DECIMAL(18, 2);

    IF p_voucherID IS NULL THEN
        RETURN 0;
    END IF;

    SELECT discountPercentage, limitVal INTO discount_percent, max_limit_val
    FROM VOUCHER
    WHERE voucherID = p_voucherID;

    IF discount_percent IS NULL THEN
        RETURN 0;
    END IF;

    SET calculated_discount = p_totalAmount * discount_percent;

    -- Apply limit if set
    IF max_limit_val > 0 AND calculated_discount > max_limit_val THEN
        RETURN max_limit_val;
    END IF;

    RETURN calculated_discount;
END$$

-- Function 1.4: Get Location Revenue (CURSOR + LOOP Example)
DROP FUNCTION IF EXISTS fn_get_location_revenue$$
CREATE FUNCTION fn_get_location_revenue(
    p_locID INT
)
RETURNS DECIMAL(18, 2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total_revenue DECIMAL(18, 2) DEFAULT 0;
    DECLARE transaction_amount DECIMAL(18, 2);
    DECLARE done INT DEFAULT FALSE;

    -- Cursor to get all completed transactions for this location
    DECLARE revenue_cursor CURSOR FOR
        SELECT T.paidAmount
        FROM `TRANSACTION` T
        JOIN RESERVATION R ON T.reservationID = R.reservationID
        JOIN BOOKING_DETAILS BD ON R.reservationID = BD.reservationID
        JOIN LOCATION_HAS_PRODUCT LHP ON BD.productID = LHP.productID
        WHERE LHP.locID = p_locID 
          AND T.status = 'COMPLETED'
          AND R.status = 'COMPLETED';
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN revenue_cursor;

    revenue_loop: LOOP
        FETCH revenue_cursor INTO transaction_amount;
        
        IF done THEN
            LEAVE revenue_loop;
        END IF;
        
        SET total_revenue = total_revenue + transaction_amount;
    END LOOP;

    CLOSE revenue_cursor;
    RETURN total_revenue;
END$$

-- Function 1.5: Check if Tourist Can Review (IF + QUERY Example)
DROP FUNCTION IF EXISTS fn_check_tourist_can_review$$
CREATE FUNCTION fn_check_tourist_can_review(
    p_touristID INT,
    p_locID INT
)
RETURNS BOOLEAN
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE completed_count INT;
    
    -- Query to check if tourist has completed reservation at this location
    SELECT COUNT(*) INTO completed_count
    FROM RESERVATION R
    JOIN BOOKING_DETAILS BD ON R.reservationID = BD.reservationID
    JOIN LOCATION_HAS_PRODUCT LHP ON BD.productID = LHP.productID
    WHERE R.touristID = p_touristID
      AND LHP.locID = p_locID
      AND R.status = 'COMPLETED';
    
    -- Use IF to return boolean result
    IF completed_count > 0 THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END$$

/* ================================================================
   PART 2: LOCATION CRUD PROCEDURES (BTL 2.1 Requirement)
   ================================================================ */

-- Procedure 2.1: Add Location (Enhanced with full validation)
DROP PROCEDURE IF EXISTS sp_add_location$$
CREATE PROCEDURE sp_add_location(
    IN p_locName VARCHAR(255),
    IN p_street VARCHAR(255),
    IN p_district VARCHAR(100),
    IN p_province VARCHAR(100),
    IN p_locType VARCHAR(50),
    IN p_ownerID INT,
    IN p_locNo VARCHAR(50),
    IN p_ward VARCHAR(100),
    IN p_priceLev VARCHAR(50),
    IN p_description TEXT
)
BEGIN
    DECLARE owner_role VARCHAR(50);
    DECLARE owner_status VARCHAR(50);
    DECLARE new_locID INT;

    -- 1. Validate required fields
    IF p_locName IS NULL OR TRIM(p_locName) = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Tên địa điểm không được để trống.';
    END IF;

    IF p_street IS NULL OR TRIM(p_street) = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Tên đường/ phố là bắt buộc.';
    END IF;

    IF p_district IS NULL OR TRIM(p_district) = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Quận/huyện là bắt buộc.';
    END IF;

    IF p_province IS NULL OR TRIM(p_province) = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Tỉnh/thành phố là bắt buộc.';
    END IF;

    -- 2. Check if location name already exists
    IF EXISTS (SELECT 1 FROM LOCATION WHERE locName = p_locName) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Tên địa điểm đã tồn tại. Vui lòng chọn tên khác.';
    END IF;

    -- 3. Validate location type
    IF p_locType NOT IN ('HOTEL', 'RESTAURANT', 'VENUE') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Loại địa điểm phải là HOTEL, RESTAURANT hoặc VENUE.';
    END IF;

    -- 4. Validate price level if provided
    IF p_priceLev IS NOT NULL AND p_priceLev NOT IN ('Bình dân', 'Trung bình', 'Cao cấp', 'Xa xỉ') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Mức giá phải là: Bình dân, Trung bình, Cao cấp hoặc Xa xỉ.';
    END IF;

    -- 5. Validate owner exists and is verified
    SELECT U.role, B.auStatus INTO owner_role, owner_status
    FROM USER_ACCOUNT U
    JOIN BUSINESS_OWNER B ON U.userID = B.BOID
    WHERE U.userID = p_ownerID;

    IF owner_role IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Chủ sở hữu (ownerID) không tồn tại.';
    ELSEIF owner_role != 'OWNER' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: UserID này không có vai trò là OWNER.';
    ELSEIF owner_status != 'VERIFIED' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Tài khoản chủ sở hữu chưa được xác thực. Vui lòng chờ admin duyệt.';
    END IF;

    -- 6. Execute INSERT
    INSERT INTO LOCATION (
        locName, street, district, province, locType, ownerID, 
        locNo, ward, priceLev, description, status, ratingPoints, hotnessScore
    ) VALUES (
        p_locName, p_street, p_district, p_province, p_locType, p_ownerID,
        p_locNo, p_ward, p_priceLev, p_description, 'ACTIVE', 0, 0
    );
    
    SET new_locID = LAST_INSERT_ID();
    
    SELECT new_locID AS locID, 'Thêm địa điểm thành công!' AS message;
END$$

-- Procedure 2.2: Update Location
DROP PROCEDURE IF EXISTS sp_update_location$$
CREATE PROCEDURE sp_update_location(
    IN p_locID INT,
    IN p_ownerID INT,
    IN p_locName VARCHAR(255),
    IN p_street VARCHAR(255),
    IN p_district VARCHAR(100),
    IN p_province VARCHAR(100),
    IN p_locNo VARCHAR(50),
    IN p_ward VARCHAR(100),
    IN p_priceLev VARCHAR(50),
    IN p_description TEXT
)
BEGIN
    DECLARE current_owner INT;
    
    -- 1. Check if location exists and verify ownership
    SELECT ownerID INTO current_owner
    FROM LOCATION
    WHERE locID = p_locID;
    
    IF current_owner IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Không tìm thấy địa điểm với ID này.';
    END IF;
    
    IF current_owner != p_ownerID THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Bạn không có quyền sửa địa điểm này.';
    END IF;
    
    -- 2. Validate new location name if provided (must be unique)
    IF p_locName IS NOT NULL AND p_locName != '' THEN
        IF EXISTS (SELECT 1 FROM LOCATION WHERE locName = p_locName AND locID != p_locID) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Tên địa điểm đã tồn tại. Vui lòng chọn tên khác.';
        END IF;
    END IF;
    
    -- 3. Validate price level if provided
    IF p_priceLev IS NOT NULL AND p_priceLev NOT IN ('Bình dân', 'Trung bình', 'Cao cấp', 'Xa xỉ') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Mức giá phải là: Bình dân, Trung bình, Cao cấp hoặc Xa xỉ.';
    END IF;
    
    -- 4. Execute UPDATE (only update non-NULL values)
    UPDATE LOCATION
    SET 
        locName = COALESCE(NULLIF(p_locName, ''), locName),
        street = COALESCE(NULLIF(p_street, ''), street),
        district = COALESCE(NULLIF(p_district, ''), district),
        province = COALESCE(NULLIF(p_province, ''), province),
        locNo = COALESCE(p_locNo, locNo),
        ward = COALESCE(p_ward, ward),
        priceLev = COALESCE(p_priceLev, priceLev),
        description = COALESCE(p_description, description)
    WHERE locID = p_locID;
    
    SELECT 'Cập nhật địa điểm thành công!' AS message;
END$$

-- Procedure 2.3: Delete Location (Soft Delete with Business Logic)
DROP PROCEDURE IF EXISTS sp_delete_location$$
CREATE PROCEDURE sp_delete_location(
    IN p_locID INT,
    IN p_ownerID INT
)
BEGIN
    DECLARE current_owner INT;
    DECLARE pending_booking_count INT;
    DECLARE product_count INT;
    
    -- 1. Verify ownership
    SELECT ownerID INTO current_owner
    FROM LOCATION
    WHERE locID = p_locID;
    
    IF current_owner IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Không tìm thấy địa điểm với ID này.';
    END IF;
    
    IF current_owner != p_ownerID THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Bạn không có quyền xóa địa điểm này.';
    END IF;
    
    -- 2. Check for pending/confirmed reservations
    SELECT COUNT(*) INTO pending_booking_count
    FROM RESERVATION R
    JOIN BOOKING_DETAILS BD ON R.reservationID = BD.reservationID
    JOIN LOCATION_HAS_PRODUCT LHP ON BD.productID = LHP.productID
    WHERE LHP.locID = p_locID
      AND R.status IN ('PENDING', 'CONFIRMED');
    
    IF pending_booking_count > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Lỗi: Không thể xóa địa điểm đang có đơn đặt chỗ đang xử lý. Vui lòng xử lý hết đơn hàng trước.';
    END IF;
    
    -- 3. Soft delete: Set status to INACTIVE
    UPDATE LOCATION
    SET status = 'INACTIVE'
    WHERE locID = p_locID;
    
    SELECT 'Đã vô hiệu hóa địa điểm thành công!' AS message,
           'Địa điểm không còn hiển thị cho khách hàng nhưng dữ liệu vẫn được lưu trữ.' AS note;
END$$

-- Procedure 2.4: Get Locations by Owner
DROP PROCEDURE IF EXISTS sp_get_locations_by_owner$$
CREATE PROCEDURE sp_get_locations_by_owner(
    IN p_ownerID INT,
    IN p_statusFilter VARCHAR(50),
    IN p_typeFilter VARCHAR(50),
    IN p_searchQuery VARCHAR(255),
    IN p_sortBy VARCHAR(50),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    -- Default values
    SET p_limit = COALESCE(p_limit, 20);
    SET p_offset = COALESCE(p_offset, 0);
    SET p_sortBy = COALESCE(p_sortBy, 'createdDate');
    
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
        (SELECT URL FROM IMAGE I JOIN LOC_HAS_IMAGE LHI ON I.imageID = LHI.imageID 
         WHERE LHI.locID = L.locID LIMIT 1) as heroImageURL,
        (SELECT COUNT(*) FROM RESERVATION R
         JOIN BOOKING_DETAILS BD ON R.reservationID = BD.reservationID
         JOIN LOCATION_HAS_PRODUCT LHP ON BD.productID = LHP.productID
         WHERE LHP.locID = L.locID) as totalReservations,
        (SELECT COUNT(*) FROM FEEDBACK F WHERE F.locID = L.locID AND F.feedbackType = 'REVIEW') as reviewCount,
        fn_get_location_revenue(L.locID) as totalRevenue
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
        CASE WHEN p_sortBy = 'rating' THEN L.ratingPoints END DESC,
        CASE WHEN p_sortBy = 'hotness' THEN L.hotnessScore END DESC,
        CASE WHEN p_sortBy = 'createdDate' THEN L.locID END DESC
    LIMIT p_limit OFFSET p_offset;
END$$

/* ================================================================
   PART 3: ADDITIONAL REQUIRED PROCEDURES (BTL 2.3)
   ================================================================ */

-- Procedure 3.1: Enhanced Search Locations
DROP PROCEDURE IF EXISTS sp_search_locations_by_criteria$$
CREATE PROCEDURE sp_search_locations_by_criteria(
    IN p_province VARCHAR(100),
    IN p_locType VARCHAR(50),
    IN p_prefName VARCHAR(255),
    IN p_minRating FLOAT,
    IN p_maxPrice VARCHAR(50),
    IN p_searchQuery VARCHAR(255),
    IN p_sortBy VARCHAR(50),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SET p_limit = COALESCE(p_limit, 20);
    SET p_offset = COALESCE(p_offset, 0);
    SET p_sortBy = COALESCE(p_sortBy, 'hotness');
    
    SELECT 
        L.locID,
        L.locName,
        L.locType,
        L.description,
        L.priceLev,
        L.ratingPoints,
        L.hotnessScore,
        CONCAT(L.street, ', ', L.district, ', ', L.province) AS fullAddress,
        (SELECT URL FROM IMAGE JOIN LOC_HAS_IMAGE LHI ON IMAGE.imageID = LHI.imageID 
         WHERE LHI.locID = L.locID LIMIT 1) AS heroImageURL,
        (SELECT COUNT(*) FROM FEEDBACK F WHERE F.locID = L.locID AND F.feedbackType = 'REVIEW') as reviewCount
    FROM LOCATION L
    LEFT JOIN LOCATION_HAS_PREFERENCE LHP ON L.locID = LHP.locID
    LEFT JOIN PREFERENCE P ON LHP.prefID = P.prefID
    WHERE 
        L.status = 'ACTIVE'
        AND (p_province IS NULL OR L.province = p_province)
        AND (p_locType IS NULL OR L.locType = p_locType)
        AND (p_prefName IS NULL OR P.prefName = p_prefName)
        AND (p_minRating IS NULL OR L.ratingPoints >= p_minRating)
        AND (p_maxPrice IS NULL OR L.priceLev = p_maxPrice OR 
             (p_maxPrice = 'Bình dân' AND L.priceLev IN ('Bình dân')) OR
             (p_maxPrice = 'Trung bình' AND L.priceLev IN ('Bình dân', 'Trung bình')) OR
             (p_maxPrice = 'Cao cấp' AND L.priceLev IN ('Bình dân', 'Trung bình', 'Cao cấp')))
        AND (p_searchQuery IS NULL OR 
             L.locName LIKE CONCAT('%', p_searchQuery, '%') OR
             L.description LIKE CONCAT('%', p_searchQuery, '%'))
    GROUP BY L.locID
    ORDER BY 
        CASE WHEN p_sortBy = 'hotness' THEN L.hotnessScore END DESC,
        CASE WHEN p_sortBy = 'rating' THEN L.ratingPoints END DESC,
        CASE WHEN p_sortBy = 'name' THEN L.locName END ASC,
        CASE WHEN p_sortBy = 'price_low' THEN 
            CASE L.priceLev 
                WHEN 'Bình dân' THEN 1
                WHEN 'Trung bình' THEN 2
                WHEN 'Cao cấp' THEN 3
                WHEN 'Xa xỉ' THEN 4
            END 
        END ASC,
        CASE WHEN p_sortBy = 'price_high' THEN 
            CASE L.priceLev 
                WHEN 'Xa xỉ' THEN 1
                WHEN 'Cao cấp' THEN 2
                WHEN 'Trung bình' THEN 3
                WHEN 'Bình dân' THEN 4
            END 
        END ASC
    LIMIT p_limit OFFSET p_offset;
END$$

-- Procedure 3.2: Owner Statistics (with GROUP BY, HAVING, ORDER BY)
DROP PROCEDURE IF EXISTS sp_get_owner_statistics$$
CREATE PROCEDURE sp_get_owner_statistics(
    IN p_ownerID INT,
    IN p_startDate DATE,
    IN p_endDate DATE,
    IN p_minRevenue DECIMAL(18,2)
)
BEGIN
    SET p_minRevenue = COALESCE(p_minRevenue, 0);
    
    SELECT
        L.locID,
        L.locName,
        L.locType,
        L.priceLev,
        COUNT(DISTINCT CASE WHEN R.status = 'COMPLETED' THEN R.reservationID END) as totalCompletedBookings,
        COUNT(DISTINCT CASE WHEN R.status IN ('PENDING', 'CONFIRMED') THEN R.reservationID END) as pendingBookings,
        COALESCE(SUM(CASE WHEN T.status = 'COMPLETED' THEN T.paidAmount ELSE 0 END), 0) as totalRevenue,
        COALESCE(AVG(RV.ratingPoints), 0) as averageRating,
        COUNT(DISTINCT F.fbID) as totalReviews
    FROM LOCATION L
    LEFT JOIN LOCATION_HAS_PRODUCT LHP ON L.locID = LHP.locID
    LEFT JOIN BOOKING_DETAILS BD ON LHP.productID = BD.productID
    LEFT JOIN RESERVATION R ON BD.reservationID = R.reservationID 
        AND (p_startDate IS NULL OR R.resTimeStamp >= p_startDate)
        AND (p_endDate IS NULL OR R.resTimeStamp <= p_endDate)
    LEFT JOIN `TRANSACTION` T ON R.reservationID = T.reservationID
    LEFT JOIN FEEDBACK F ON L.locID = F.locID AND F.feedbackType = 'REVIEW'
    LEFT JOIN REVIEW RV ON F.fbID = RV.reviewID
    WHERE L.ownerID = p_ownerID
    GROUP BY L.locID, L.locName, L.locType, L.priceLev
    HAVING totalRevenue >= p_minRevenue
    ORDER BY totalRevenue DESC, averageRating DESC;
END$$

-- Procedure 3.3: Preference Auto-Update System
DROP PROCEDURE IF EXISTS sp_update_tourist_preferences_auto$$
CREATE PROCEDURE sp_update_tourist_preferences_auto(
    IN p_touristID INT
)
proc_body: BEGIN  -- ← Added label here for LEAVE statement
    DECLARE days_since_update INT;
    DECLARE new_pref_id INT;
    DECLARE new_pref_count INT;
    DECLARE done INT DEFAULT FALSE;
    
    -- Cursor to get top 3 preferences from last 30 days
    DECLARE pref_cursor CURSOR FOR
        SELECT LHP.prefID, COUNT(*) as freq
        FROM RESERVATION R
        JOIN BOOKING_DETAILS BD ON R.reservationID = BD.reservationID
        JOIN LOCATION_HAS_PRODUCT LHP_PROD ON BD.productID = LHP_PROD.productID
        JOIN LOCATION_HAS_PREFERENCE LHP ON LHP_PROD.locID = LHP.locID
        WHERE R.touristID = p_touristID
          AND R.resTimeStamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          AND NOT EXISTS (
              SELECT 1 FROM TOURIST_HAS_PREFERENCE THP 
              WHERE THP.touristID = p_touristID AND THP.prefID = LHP.prefID
          )
        GROUP BY LHP.prefID
        ORDER BY freq DESC
        LIMIT 3;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Check if 30 days have passed since last update
    SELECT DATEDIFF(NOW(), lastPreferenceUpdate) INTO days_since_update
    FROM TOURIST
    WHERE touristID = p_touristID;
    
    IF days_since_update < 30 THEN
        SELECT CONCAT('Preferences will be updated in ', 30 - days_since_update, ' days.') as message;
        LEAVE proc_body;  -- ← Now uses the label instead of procedure name
    END IF;
    
    -- Add new preferences
    OPEN pref_cursor;
    
    pref_loop: LOOP
        FETCH pref_cursor INTO new_pref_id, new_pref_count;
        
        IF done THEN
            LEAVE pref_loop;
        END IF;
        
        -- Insert new preference
        INSERT IGNORE INTO TOURIST_HAS_PREFERENCE (touristID, prefID)
        VALUES (p_touristID, new_pref_id);
    END LOOP;
    
    CLOSE pref_cursor;
    
    -- Update timestamp
    UPDATE TOURIST
    SET lastPreferenceUpdate = NOW()
    WHERE touristID = p_touristID;
    
    SELECT 'Preferences updated successfully based on your recent bookings!' as message;
END$$

-- Procedure 3.4: Check and Refresh All Preferences (for Event Scheduler)
DROP PROCEDURE IF EXISTS sp_check_and_refresh_preferences$$
CREATE PROCEDURE sp_check_and_refresh_preferences()
BEGIN
    DECLARE tourist_id INT;
    DECLARE done INT DEFAULT FALSE;
    
    -- Cursor for all tourists who need preference update
    DECLARE tourist_cursor CURSOR FOR
        SELECT touristID
        FROM TOURIST
        WHERE DATEDIFF(NOW(), lastPreferenceUpdate) >= 30;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN tourist_cursor;
    
    tourist_loop: LOOP
        FETCH tourist_cursor INTO tourist_id;
        
        IF done THEN
            LEAVE tourist_loop;
        END IF;
        
        CALL sp_update_tourist_preferences_auto(tourist_id);
    END LOOP;
    
    CLOSE tourist_cursor;
END$$

DELIMITER ;

-- Create Event Scheduler for auto preference updates
SET GLOBAL event_scheduler = ON;

DELIMITER $$
CREATE EVENT IF NOT EXISTS evt_refresh_all_tourist_preferences
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    CALL sp_check_and_refresh_preferences();
END$$
DELIMITER ;

-- Note: Complete the file with existing procedures from trigger_func_proc.sql below
