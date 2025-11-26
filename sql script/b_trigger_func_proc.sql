/*
================================================================
 KỊCH BẢN SQL TOÀN DIỆN CHO ỨNG DỤNG VIVUVIET
================================================================
 NỘI DUNG:
 
 PHẦN 1: HÀM TRỢ GIÚP (HELPER FUNCTIONS)
 PHẦN 2: KỊCH BẢN DU KHÁCH (TOURIST SCENARIOS)
 PHẦN 3: KỊCH BẢN CHỦ DOANH NGHIỆP (OWNER SCENARIOS)
 PHẦN 4: KỊCH BẢN QUẢN TRỊ VIÊN (ADMIN SCENARIOS)
 PHẦN 5: TRIGGER TỰ ĐỘNG (AUTOMATION & DATA INTEGRITY)
================================================================
*/

USE VIVUVIET;
DELIMITER $$

/*
================================================================
 PHẦN 1: HÀM TRỢ GIÚP (HELPER FUNCTIONS)
================================================================
*/

-- ---
-- HÀM 1.1: TÍNH TỔNG TIỀN GỐC CỦA ĐƠN HÀNG
-- (Sử dụng CURSOR + LOOP theo yêu cầu BTL 2.4)
-- ---
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

    -- 1. Khai báo CURSOR
    DECLARE details_cursor CURSOR FOR
        SELECT quantity, unitPrice
        FROM BOOKING_DETAILS
        WHERE reservationID = p_reservationID;
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- 2. Validate
    IF p_reservationID IS NULL THEN
        RETURN 0;
    END IF;
    
    OPEN details_cursor;

    -- 3. Bắt đầu LOOP
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

-- ---
-- HÀM 1.2: TÍNH HẠNG THÀNH VIÊN
-- (Sử dụng IF + QUERY theo yêu cầu BTL 2.4)
-- ---
DROP FUNCTION IF EXISTS fn_get_tourist_rank$$
CREATE FUNCTION fn_get_tourist_rank(
    p_touristID INT
)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total_spent DECIMAL(18, 2);
    DECLARE user_rank INT;

    -- 1. Validate Input
    IF p_touristID IS NULL THEN
        RETURN 0; -- Bronze
    END IF;

    -- 2. Query Data
    SELECT totalSpent INTO total_spent
    FROM TOURIST
    WHERE touristID = p_touristID;

    IF total_spent IS NULL THEN
        RETURN 0; -- Bronze
    END IF;

    -- 3. Sử dụng IF (Quy tắc nghiệp vụ tự định nghĩa)
    IF total_spent >= 50000000 THEN
        SET user_rank = 4; -- Diamond
    ELSEIF total_spent >= 20000000 THEN
        SET user_rank = 3; -- Platinum
    ELSEIF total_spent >= 10000000 THEN
        SET user_rank = 2; -- Gold
    ELSEIF total_spent >= 5000000 THEN
        SET user_rank = 1; -- Silver
    ELSE
        SET user_rank = 0; -- Bronze
    END IF;

    RETURN user_rank;
END$$

-- ---
-- HÀM 1.3: TÍNH SỐ TIỀN GIẢM GIÁ
-- Tính toán số tiền được giảm khi áp dụng voucher
-- ---
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

    -- Nếu voucher có giới hạn (limitVal > 0) và số tiền giảm vượt quá giới hạn
    IF max_limit_val > 0 AND calculated_discount > max_limit_val THEN
        RETURN max_limit_val;
    END IF;

    RETURN calculated_discount;
END$$


/*
================================================================
 PHẦN 2: KỊCH BẢN DU KHÁCH (TOURIST SCENARIOS)
================================================================
*/

-- ---
-- KỊCH BẢN 2.1: ĐĂNG NHẬP
-- ---
DROP PROCEDURE IF EXISTS sp_user_login$$
CREATE PROCEDURE sp_user_login(
    IN p_mail VARCHAR(255)
)
BEGIN
    -- Chỉ trả về thông tin cần thiết cho việc xác thực
    -- Cần kiểm tra status nếu có
    SELECT userID, mail, password, role
    FROM USER_ACCOUNT
    WHERE mail = p_mail;
END$$

-- ---
-- KỊCH BẢN 2.2: ĐĂNG KÝ (DU KHÁCH)
-- ---
DROP PROCEDURE IF EXISTS sp_tourist_register$$
CREATE PROCEDURE sp_tourist_register(
    IN p_mail VARCHAR(255),
    IN p_fullName VARCHAR(100),
    IN p_password VARCHAR(255), -- Đã băm (hashed) ở backend
    IN p_DOB DATE,
    IN p_nationality VARCHAR(100),
    IN p_legalID VARCHAR(100)
)
BEGIN
    DECLARE new_userID INT;

    -- 1. Validate
    IF p_mail IS NULL OR p_mail = '' OR p_password IS NULL OR p_password = '' OR p_fullName IS NULL OR p_fullName = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Email, Tên và Mật khẩu không được để trống.';
    END IF;

    -- Validate định dạng email (đơn giản)
    IF p_mail NOT LIKE '%_@%_.__%' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Email không đúng định dạng.';
    END IF;

    -- Validate tuổi (Ràng buộc 7, BTL1)
    IF p_DOB IS NOT NULL AND TIMESTAMPDIFF(YEAR, p_DOB, CURDATE()) < 18 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Bạn phải đủ 18 tuổi để đăng ký.';
    END IF;

    -- Validate trùng email (UNIQUE)
    IF EXISTS (SELECT 1 FROM USER_ACCOUNT WHERE mail = p_mail) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Email này đã được sử dụng.';
    END IF;

    -- 2. Thực hiện (dùng TRANSACTION)
    START TRANSACTION;
    
    -- Tạo USER_ACCOUNT (Bảng cha)
    INSERT INTO USER_ACCOUNT (mail, fullName, password, DOB, role)
    VALUES (p_mail, p_fullName, p_password, p_DOB, 'TOURIST');
    
    SET new_userID = LAST_INSERT_ID();

    -- Tạo TOURIST (Bảng con)
    INSERT INTO TOURIST (touristID, nationality, legalID, loyaltypoints, totalSpent, rankLevel)
    VALUES (new_userID, p_nationality, p_legalID, 0, 0, 0);
    
    COMMIT;
    
    -- Trả về ID user mới
    SELECT new_userID AS 'userID';
END$$

-- ---
-- KỊCH BẢN 2.3: TÌM KIẾM VÀ LỌC ĐỊA ĐIỂM
-- (Yêu cầu BTL 2.3.1)
-- ---
DROP PROCEDURE IF EXISTS sp_search_locations_by_criteria$$
CREATE PROCEDURE sp_search_locations_by_criteria(
    IN p_province VARCHAR(100),
    IN p_locType VARCHAR(50),
    IN p_prefName VARCHAR(255), -- Ví dụ: 'Biển', 'Sang trọng'
    IN p_minRating FLOAT
)
BEGIN
    SELECT 
        L.locID,
        L.locName,
        L.locType,
        L.description,
        L.priceLev,
        L.ratingPoints,
        CONCAT(L.street, ', ', L.district, ', ', L.province) AS fullAddress,
        (SELECT URL FROM IMAGE 
         JOIN LOC_HAS_IMAGE LHI ON IMAGE.imageID = LHI.imageID 
         WHERE LHI.locID = L.locID LIMIT 1) AS heroImageURL
    FROM LOCATION L
    LEFT JOIN LOCATION_HAS_PREFERENCE LHP ON L.locID = LHP.locID
    LEFT JOIN PREFERENCE P ON LHP.prefID = P.prefID
    WHERE 
        L.status = 'ACTIVE'
        AND (p_province IS NULL OR L.province = p_province)
        AND (p_locType IS NULL OR L.locType = p_locType)
        AND (p_prefName IS NULL OR P.prefName = p_prefName)
        AND (p_minRating IS NULL OR L.ratingPoints >= p_minRating)
    GROUP BY L.locID -- Do join M-N
    ORDER BY L.hotnessScore DESC, L.ratingPoints DESC;
END$$

-- ---
-- KỊCH BẢN 2.4: XEM CHI TIẾT ĐỊA ĐIỂM
-- (Dùng nhiều result set để trả về cho web)
-- ---
DROP PROCEDURE IF EXISTS sp_get_location_details$$
CREATE PROCEDURE sp_get_location_details(
    IN p_locID INT
)
BEGIN
    -- 1. Thông tin chính
    SELECT *, CONCAT(L.street, ', ', L.district, ', ', L.province) AS fullAddress
    FROM LOCATION L
    WHERE L.locID = p_locID;
    
    -- 2. Danh sách tiện ích
    SELECT U.uName, U.uType
    FROM UTILITY U
    JOIN LOC_HAS_UTILITY LU ON U.utility = LU.utility
    WHERE LU.locID = p_locID;
    
    -- 3. Danh sách sản phẩm (Phòng, Vé, Bàn)
    SELECT P.productID, P.productName, P.description, P.basePrice, P.category
    FROM PRODUCT P
    JOIN LOCATION_HAS_PRODUCT LHP ON P.productID = LHP.productID
    WHERE LHP.locID = p_locID;
    
    -- 4. Danh sách đánh giá (Reviews)
    SELECT 
        F.fbID, F.fbDateTime, F.likeCount,
        R.ratingPoints,
        (SELECT content FROM COMMENT WHERE commentID = F.fbID) AS reviewContent,
        U.userID, U.fullName
    FROM FEEDBACK F
    JOIN REVIEW R ON F.fbID = R.reviewID
    JOIN USER_ACCOUNT U ON F.userID = U.userID
    WHERE F.locID = p_locID
    ORDER BY F.likeCount DESC, F.fbDateTime DESC;
    
END$$

-- ---
-- KỊCH BẢN 2.5: TẠO ĐƠN ĐẶT HÀNG (CORE)
-- Dùng JSON để nhận danh sách sản phẩm
-- ---
DROP PROCEDURE IF EXISTS sp_create_reservation$$
CREATE PROCEDURE sp_create_reservation(
    IN p_touristID INT,
    IN p_voucherID INT,
    IN p_note VARCHAR(500),
    IN p_itemsJSON JSON -- '[{"productID": 1, "quantity": 2, "checkin": "...", "checkout": "...", "unitPrice": 8500000}, ...]'
)
BEGIN
    DECLARE new_reservationID INT;
    DECLARE total_amount DECIMAL(18, 2) DEFAULT 0;
    DECLARE total_discount DECIMAL(18, 2) DEFAULT 0;
    DECLARE item_count INT DEFAULT 0;

    -- Validate
    IF p_touristID IS NULL OR JSON_LENGTH(p_itemsJSON) = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Thiếu thông tin Du khách hoặc Sản phẩm.';
    END IF;

    -- Bắt đầu Transaction
    START TRANSACTION;
    
    -- 1. Tạo đơn hàng (RESERVATION)
    INSERT INTO RESERVATION (touristID, voucherID, status, note, resTimeStamp)
    VALUES (p_touristID, p_voucherID, 'PENDING', p_note, NOW());
    
    SET new_reservationID = LAST_INSERT_ID();
    
    -- 2. Thêm chi tiết đơn hàng (BOOKING_DETAILS)
    SET item_count = JSON_LENGTH(p_itemsJSON);
    
    -- Dùng WHILE LOOP
    WHILE item_count > 0 DO
        SET item_count = item_count - 1;
        
        INSERT INTO BOOKING_DETAILS (reservationID, itemID, productID, quantity, unitPrice, checkingDateTime, checkoutDateTime)
        VALUES (
            new_reservationID,
            item_count + 1, -- itemID (tự tăng)
            JSON_UNQUOTE(JSON_EXTRACT(p_itemsJSON, CONCAT('$[', item_count, '].productID'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_itemsJSON, CONCAT('$[', item_count, '].quantity'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_itemsJSON, CONCAT('$[', item_count, '].unitPrice'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_itemsJSON, CONCAT('$[', item_count, '].checkin'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_itemsJSON, CONCAT('$[', item_count, '].checkout')))
        );
    END WHILE;
    
    -- 3. Cập nhật tổng tiền (Trigger sẽ tự động làm việc này)
    SET total_amount = fn_calculate_reservation_total(new_reservationID);
    SET total_discount = fn_calculate_discount(total_amount, p_voucherID);
    
    UPDATE RESERVATION
    SET 
        totalAmount = total_amount,
        totalDiscount = total_discount,
        numOfItems = JSON_LENGTH(p_itemsJSON)
    WHERE reservationID = new_reservationID;
    
    COMMIT;
    
    SELECT new_reservationID AS 'reservationID';
END$$

-- ---
-- KỊCH BẢN 2.6: HỦY ĐƠN HÀNG
-- ---
DROP PROCEDURE IF EXISTS sp_cancel_reservation$$
CREATE PROCEDURE sp_cancel_reservation(
    IN p_reservationID INT,
    IN p_touristID INT -- Xác thực chủ đơn
)
BEGIN
    DECLARE res_status VARCHAR(50);

    SELECT status INTO res_status
    FROM RESERVATION
    WHERE reservationID = p_reservationID AND touristID = p_touristID;

    IF res_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Không tìm thấy đơn hàng hoặc bạn không có quyền hủy.';
    END IF;

    -- Ràng buộc nghiệp vụ (BTL1)
    IF res_status IN ('COMPLETED', 'CANCELLED') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Không thể hủy đơn hàng đã hoàn thành hoặc đã hủy.';
    END IF;
    
    -- Cập nhật trạng thái
    UPDATE RESERVATION
    SET status = 'CANCELLED'
    WHERE reservationID = p_reservationID;
    
END$$

-- ---
-- KỊCH BẢN 2.7: GỬI ĐÁNH GIÁ (REVIEW)
-- ---
DROP PROCEDURE IF EXISTS sp_add_review$$
CREATE PROCEDURE sp_add_review(
    IN p_userID INT,
    IN p_locID INT,
    IN p_ratingPoints INT,
    IN p_content TEXT
)
BEGIN
    DECLARE new_fbID INT;

    -- (Trigger trg_before_review_insert_check_completed sẽ tự động kiểm tra
    -- xem user này đã hoàn thành đặt chỗ ở đây chưa)
    
    START TRANSACTION;
    
    -- 1. Tạo FEEDBACK (Cha)
    INSERT INTO FEEDBACK (userID, locID, feedbackType, fbDateTime, likeCount)
    VALUES (p_userID, p_locID, 'REVIEW', NOW(), 0);
    
    SET new_fbID = LAST_INSERT_ID();
    
    -- 2. Tạo REVIEW (Con)
    INSERT INTO REVIEW (reviewID, ratingPoints)
    VALUES (new_fbID, p_ratingPoints);
    
    -- 3. Tạo COMMENT (Con)
    -- (Theo thiết kế của bạn, nội dung REVIEW được lưu trong COMMENT)
    INSERT INTO COMMENT (commentID, role, content)
    VALUES (new_fbID, 'REVIEW_CONTENT', p_content);
    
    COMMIT;
    
    -- (Trigger trg_after_review_insert sẽ tự động cập nhật điểm trung bình)
    
    SELECT new_fbID AS 'fbID';
END$$

-- ---
-- KỊCH BẢN 2.8: THÍCH / BỎ THÍCH (LIKE)
-- ---
DROP PROCEDURE IF EXISTS sp_toggle_like_feedback$$
CREATE PROCEDURE sp_toggle_like_feedback(
    IN p_userID INT,
    IN p_fbID INT
)
BEGIN
    -- Kiểm tra xem đã like chưa
    IF EXISTS (SELECT 1 FROM FB_LIKES WHERE userID = p_userID AND fbID = p_fbID) THEN
        -- Bỏ thích (DELETE)
        DELETE FROM FB_LIKES WHERE userID = p_userID AND fbID = p_fbID;
    ELSE
        -- Thích (INSERT)
        INSERT INTO FB_LIKES (userID, fbID) VALUES (p_userID, p_fbID);
    END IF;
    
    -- (Trigger trg_update_feedback_likeCount sẽ tự động cập nhật likeCount)
END$$


/*
================================================================
 PHẦN 3: KỊCH BẢN CHỦ DOANH NGHIỆP (OWNER SCENARIOS)
================================================================
*/

-- ---
-- KỊCH BẢN 3.1: ĐĂNG KÝ (CHỦ DOANH NGHIỆP)
-- ---
DROP PROCEDURE IF EXISTS sp_owner_register$$
CREATE PROCEDURE sp_owner_register(
    IN p_mail VARCHAR(255),
    IN p_fullName VARCHAR(100),
    IN p_password VARCHAR(255), -- Đã băm (hashed)
    IN p_taxCode VARCHAR(100) -- Mã số thuế
)
BEGIN
    DECLARE new_userID INT;

    -- (Tương tự sp_tourist_register, có thể validate thêm MST)
    IF p_mail IS NULL OR p_mail = '' OR p_password IS NULL OR p_password = '' OR p_fullName IS NULL OR p_fullName = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Email, Tên và Mật khẩu không được để trống.';
    END IF;
    IF p_taxCode IS NULL OR p_taxCode = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Mã số thuế là bắt buộc.';
    END IF;
    IF EXISTS (SELECT 1 FROM USER_ACCOUNT WHERE mail = p_mail) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Email này đã được sử dụng.';
    END IF;
    IF EXISTS (SELECT 1 FROM BUSINESS_OWNER WHERE taxCode = p_taxCode) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Mã số thuế này đã được đăng ký.';
    END IF;

    -- 2. Thực hiện (dùng TRANSACTION)
    START TRANSACTION;
    
    INSERT INTO USER_ACCOUNT (mail, fullName, password, role)
    VALUES (p_mail, p_fullName, p_password, 'OWNER');
    
    SET new_userID = LAST_INSERT_ID();

    -- Tạo BUSINESS_OWNER (Bảng con)
    INSERT INTO BUSINESS_OWNER (BOID, taxCode, auStatus)
    VALUES (new_userID, p_taxCode, 'PENDING'); -- Chờ Admin duyệt
    
    COMMIT;
    
    SELECT new_userID AS 'userID';
END$$

-- ---
-- KỊCH BẢN 3.2: QUẢN LÝ ĐỊA ĐIỂM (CRUD)
-- (Yêu cầu BTL 2.1)
-- ---

-- 3.2.1 THÊM ĐỊA ĐIỂM
DROP PROCEDURE IF EXISTS sp_add_location$$
CREATE PROCEDURE sp_add_location(
    IN p_locName VARCHAR(255),
    IN p_street VARCHAR(255),
    IN p_district VARCHAR(100),
    IN p_province VARCHAR(100),
    IN p_locType VARCHAR(50),
    IN p_ownerID INT,
    IN p_description TEXT
)
BEGIN
    DECLARE owner_role VARCHAR(50);
    DECLARE owner_status VARCHAR(50);

    -- 1. Validate
    IF p_locName IS NULL OR p_locName = '' OR p_street IS NULL OR p_street = '' OR p_district IS NULL OR p_district = '' OR p_province IS NULL OR p_province = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Tên và địa chỉ (đường, quận, tỉnh) là bắt buộc.';
    END IF;

    -- 2. Validate nghiệp vụ
    SELECT U.role, B.auStatus INTO owner_role, owner_status
    FROM USER_ACCOUNT U
    JOIN BUSINESS_OWNER B ON U.userID = B.BOID
    WHERE U.userID = p_ownerID;

    IF owner_role IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Chủ sở hữu (ownerID) không tồn tại.';
    ELSEIF owner_role != 'OWNER' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: UserID này không có vai trò là OWNER.';
    ELSEIF owner_status != 'VERIFIED' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Tài khoản chủ sở hữu chưa được xác thực (VERIFIED).';
    END IF;

    -- 3. INSERT
    INSERT INTO LOCATION (
        locName, street, district, province, locType, ownerID, description,
        status, ratingPoints, hotnessScore
    ) VALUES (
        p_locName, p_street, p_district, p_province, p_locType, p_ownerID, p_description,
        'ACTIVE', 0, 0
    );
    
    SELECT LAST_INSERT_ID() AS 'locID';
END$$

-- 3.2.2 CẬP NHẬT ĐỊA ĐIỂM
DROP PROCEDURE IF EXISTS sp_update_location_details$$
CREATE PROCEDURE sp_update_location_details(
    IN p_locID INT,
    IN p_ownerID INT, -- Để xác thực
    IN p_locName VARCHAR(255),
    IN p_street VARCHAR(255),
    IN p_description TEXT,
    IN p_priceLev VARCHAR(50)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM LOCATION WHERE locID = p_locID AND ownerID = p_ownerID) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Không tìm thấy địa điểm hoặc bạn không có quyền sửa.';
    END IF;

    UPDATE LOCATION
    SET 
        locName = COALESCE(p_locName, locName),
        street = COALESCE(p_street, street),
        description = COALESCE(p_description, description),
        priceLev = COALESCE(p_priceLev, priceLev)
    WHERE locID = p_locID;
END$$

-- 3.2.3 NGỪNG KÍCH HOẠT (DELETE AN TOÀN)
DROP PROCEDURE IF EXISTS sp_deactivate_location$$
CREATE PROCEDURE sp_deactivate_location(
    IN p_locID INT,
    IN p_ownerID INT -- Để xác thực
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM LOCATION WHERE locID = p_locID AND ownerID = p_ownerID) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Không tìm thấy địa điểm hoặc bạn không có quyền này.';
    END IF;

    UPDATE LOCATION
    SET status = 'INACTIVE' -- Thay vì DELETE
    WHERE locID = p_locID;
END$$

-- ---
-- KỊCH BẢN 3.3: LẤY DANH SÁCH ĐẶT HÀNG (BOOKING) CỦA CHỦ DOANH NGHIỆP
-- ---
DROP PROCEDURE IF EXISTS sp_get_bookings_for_owner$$
CREATE PROCEDURE sp_get_bookings_for_owner(
    IN p_ownerID INT,
    IN p_statusFilter VARCHAR(50) -- 'PENDING', 'CONFIRMED', ...
)
BEGIN
    SELECT 
        R.reservationID, R.status, R.resTimeStamp, R.totalAmount, R.note,
        L.locName,
        U.fullName AS touristName
    FROM RESERVATION R
    JOIN BOOKING_DETAILS BD ON R.reservationID = BD.reservationID
    JOIN LOCATION_HAS_PRODUCT LHP ON BD.productID = LHP.productID
    JOIN LOCATION L ON LHP.locID = L.locID
    JOIN USER_ACCOUNT U ON R.touristID = U.userID
    WHERE
        L.ownerID = p_ownerID
        AND (p_statusFilter IS NULL OR R.status = p_statusFilter)
    GROUP BY R.reservationID -- Đảm bảo mỗi đơn hàng 1 dòng
    ORDER BY R.resTimeStamp DESC;
END$$

-- ---
-- KỊCH BẢN 3.4: XÁC NHẬN ĐƠN HÀNG
-- ---
DROP PROCEDURE IF EXISTS sp_confirm_booking$$
CREATE PROCEDURE sp_confirm_booking(
    IN p_reservationID INT,
    IN p_ownerID INT
)
BEGIN
    DECLARE is_owner INT;

    -- Kiểm tra xem Owner này có quyền xác nhận đơn này không
    SELECT COUNT(*) INTO is_owner
    FROM RESERVATION R
    JOIN BOOKING_DETAILS BD ON R.reservationID = BD.reservationID
    JOIN LOCATION_HAS_PRODUCT LHP ON BD.productID = LHP.productID
    JOIN LOCATION L ON LHP.locID = L.locID
    WHERE R.reservationID = p_reservationID AND L.ownerID = p_ownerID;

    IF is_owner = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Bạn không có quyền xác nhận đơn hàng này.';
    END IF;
    
    -- Chỉ xác nhận đơn 'PENDING'
    UPDATE RESERVATION
    SET status = 'CONFIRMED'
    WHERE reservationID = p_reservationID AND status = 'PENDING';
END$$

-- ---
-- KỊCH BẢN 3.5: TRẢ LỜI ĐÁNH GIÁ (REPLY TO FEEDBACK)
-- ---
DROP PROCEDURE IF EXISTS sp_owner_reply_to_feedback$$
CREATE PROCEDURE sp_owner_reply_to_feedback(
    IN p_ownerID INT,
    IN p_parentFeedbackID INT, -- ID của review/comment bị trả lời
    IN p_content TEXT
)
BEGIN
    DECLARE new_fbID INT;
    DECLARE loc_id INT;

    -- Lấy locID của feedback gốc
    SELECT locID INTO loc_id
    FROM FEEDBACK
    WHERE fbID = p_parentFeedbackID;

    -- Kiểm tra xem Owner có sở hữu địa điểm của feedback này không
    IF NOT EXISTS (SELECT 1 FROM LOCATION WHERE locID = loc_id AND ownerID = p_ownerID) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Bạn không có quyền trả lời feedback này.';
    END IF;
    
    START TRANSACTION;
    
    -- 1. Tạo FEEDBACK (Cha)
    INSERT INTO FEEDBACK (userID, locID, feedbackType, fbDateTime)
    VALUES (p_ownerID, loc_id, 'COMMENT', NOW());
    
    SET new_fbID = LAST_INSERT_ID();
    
    -- 2. Tạo COMMENT (Con)
    INSERT INTO COMMENT (commentID, role, content)
    VALUES (new_fbID, 'OWNER_REPLY', p_content);
    
    -- 3. Liên kết trả lời
    INSERT INTO COMMENTS_TO (commentID, parentID)
    VALUES (new_fbID, p_parentFeedbackID);
    
    COMMIT;
    
    SELECT new_fbID AS 'fbID';
END$$

-- ---
-- KỊCH BẢN 3.6: THỐNG KÊ DOANH THU CHO CHỦ DOANH NGHIỆP
-- (Yêu cầu BTL 2.3.2)
-- ---
DROP PROCEDURE IF EXISTS sp_get_owner_location_statistics$$
CREATE PROCEDURE sp_get_owner_location_statistics(
    IN p_ownerID INT,
    IN p_minRevenue DECIMAL(18, 2)
)
BEGIN
    SELECT
        L.locName,
        L.locType,
        COUNT(DISTINCT R.reservationID) AS totalCompletedBookings,
        SUM(T.paidAmount) AS totalRevenue, -- Tính trên tiền thực trả
        AVG(RV.ratingPoints) AS averageRating
    FROM LOCATION L
    LEFT JOIN LOCATION_HAS_PRODUCT LHP ON L.locID = LHP.locID
    LEFT JOIN BOOKING_DETAILS BD ON LHP.productID = BD.productID
    LEFT JOIN RESERVATION R ON BD.reservationID = R.reservationID
    LEFT JOIN `TRANSACTION` T ON R.reservationID = T.reservationID
    LEFT JOIN FEEDBACK F ON L.locID = F.locID
    LEFT JOIN REVIEW RV ON F.fbID = RV.reviewID
    -- Mệnh đề WHERE
    WHERE
        L.ownerID = p_ownerID
        AND (R.status = 'COMPLETED' OR R.reservationID IS NULL) -- Lấy cả loc không có booking
        AND (T.status = 'COMPLETED' OR T.transactionID IS NULL)
    -- Mệnh đề GROUP BY
    GROUP BY
        L.locID, L.locName, L.locType
    -- Mệnh đề HAVING
    HAVING
        totalRevenue >= p_minRevenue
    -- Mệnh đề ORDER BY
    ORDER BY
        totalRevenue DESC;
END$$


/*
================================================================
 PHẦN 4: KỊCH BẢN QUẢN TRỊ VIÊN (ADMIN SCENARIOS)
================================================================
*/

-- ---
-- KỊCH BẢN 4.1: DUYỆT TÀI KHOẢN CHỦ DOANH NGHIỆP
-- ---
DROP PROCEDURE IF EXISTS sp_admin_verify_owner$$
CREATE PROCEDURE sp_admin_verify_owner(
    IN p_adminID INT,
    IN p_ownerID INT,
    IN p_newStatus VARCHAR(50) -- 'VERIFIED', 'REJECTED'
)
BEGIN
    -- 1. Kiểm tra Admin
    IF NOT EXISTS (SELECT 1 FROM ADMINISTRATOR WHERE adminID = p_adminID) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Bạn không có quyền Admin.';
    END IF;

    -- 2. Validate
    IF p_newStatus IS NULL OR p_newStatus NOT IN ('VERIFIED', 'REJECTED', 'PENDING') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Trạng thái không hợp lệ.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM BUSINESS_OWNER WHERE BOID = p_ownerID) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Không tìm thấy Owner ID.';
    END IF;

    -- 3. Cập nhật
    UPDATE BUSINESS_OWNER
    SET auStatus = p_newStatus
    WHERE BOID = p_ownerID;
END$$

-- ---
-- KỊCH BẢN 4.2: TẠO MÃ GIẢM GIÁ (VOUCHER)
-- ---
DROP PROCEDURE IF EXISTS sp_admin_create_voucher$$
CREATE PROCEDURE sp_admin_create_voucher(
    IN p_adminID INT,
    IN p_discountPercentage FLOAT,
    IN p_slots INT,
    IN p_voucherDescription VARCHAR(500),
    IN p_startDate DATE,
    IN p_expDate DATE,
    IN p_rankRequirement INT,
    IN p_limitVal DECIMAL(18, 2)
)
BEGIN
    -- 1. Kiểm tra Admin
    IF NOT EXISTS (SELECT 1 FROM ADMINISTRATOR WHERE adminID = p_adminID) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Bạn không có quyền Admin.';
    END IF;
    
    -- 2. Validate (CONSTRAINT đã kiểm tra nhiều rồi)
    IF p_discountPercentage <= 0 OR p_discountPercentage > 1 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: % giảm giá phải từ (0, 1].';
    END IF;
    IF p_expDate <= p_startDate THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Ngày hết hạn phải sau ngày bắt đầu.';
    END IF;

    -- 3. Thêm
    INSERT INTO VOUCHER (
        rankRequirement, limitVal, discountPercentage, slots, 
        used_slots, voucherDescription, startDate, expDate
    ) VALUES (
        p_rankRequirement, p_limitVal, p_discountPercentage, p_slots,
        0, p_voucherDescription, p_startDate, p_expDate
    );
    
    SELECT LAST_INSERT_ID() AS 'voucherID';
END$$

-- ---
-- KỊCH BẢN 4.3: XÓA FEEDBACK (VI PHẠM)
-- ---
DROP PROCEDURE IF EXISTS sp_admin_delete_feedback$$
CREATE PROCEDURE sp_admin_delete_feedback(
    IN p_adminID INT,
    IN p_fbID INT
)
BEGIN
    -- 1. Kiểm tra Admin
    IF NOT EXISTS (SELECT 1 FROM ADMINISTRATOR WHERE adminID = p_adminID) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Bạn không có quyền Admin.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM FEEDBACK WHERE fbID = p_fbID) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Không tìm thấy feedback này.';
    END IF;

    -- 2. Xóa
    -- (Do ON DELETE CASCADE, xóa FEEDBACK sẽ xóa REVIEW/COMMENT/COMMENTS_TO/FB_LIKES/FB_HAS_IMAGE)
    DELETE FROM FEEDBACK WHERE fbID = p_fbID;
    
    -- (Trigger cập nhật điểm trung bình sẽ chạy)
END$$

/*
================================================================
 PHẦN 5: TRIGGER TỰ ĐỘNG (AUTOMATION & DATA INTEGRITY)
================================================================
*/

-- ---
-- TRIGGER 5.1: CẬP NHẬT likeCount KHI THÍCH/BỎ THÍCH
-- ---
DROP TRIGGER IF EXISTS trg_after_like_update_count$$
CREATE TRIGGER trg_after_like_update_count
AFTER INSERT ON FB_LIKES
FOR EACH ROW
BEGIN
    UPDATE FEEDBACK SET likeCount = likeCount + 1 WHERE fbID = NEW.fbID;
END$$

DROP TRIGGER IF EXISTS trg_after_dislike_update_count$$
CREATE TRIGGER trg_after_dislike_update_count
AFTER DELETE ON FB_LIKES
FOR EACH ROW
BEGIN
    UPDATE FEEDBACK SET likeCount = likeCount - 1 WHERE fbID = OLD.fbID;
END$$

-- ---
-- TRIGGER 5.2: CẬP NHẬT ĐIỂM RATING TRUNG BÌNH CỦA LOCATION
-- ---
DROP PROCEDURE IF EXISTS sp_update_location_rating$$
CREATE PROCEDURE sp_update_location_rating(IN p_locID INT)
BEGIN
    DECLARE avg_rating FLOAT;
    
    SELECT AVG(RV.ratingPoints) INTO avg_rating
    FROM REVIEW RV
    JOIN FEEDBACK F ON RV.reviewID = F.fbID
    WHERE F.locID = p_locID;

    UPDATE LOCATION L
    SET L.ratingPoints = IFNULL(avg_rating, 0)
    WHERE L.locID = p_locID;

    -- Ràng buộc 8: Địa điểm có đánh giá quá thấp sẽ bị tạm ngưng (INACTIVE)
    -- Ngưỡng ví dụ: < 1.5 sao và phải có ít nhất 3 đánh giá để tránh oan sai
    IF avg_rating IS NOT NULL AND avg_rating < 1.5 THEN
        IF (SELECT COUNT(*) FROM FEEDBACK WHERE locID = p_locID AND feedbackType = 'REVIEW') >= 3 THEN
            UPDATE LOCATION 
            SET status = 'INACTIVE' 
            WHERE locID = p_locID AND status = 'ACTIVE';
        END IF;
    END IF;
END$$

DROP TRIGGER IF EXISTS trg_after_review_insert$$
CREATE TRIGGER trg_after_review_insert
AFTER INSERT ON REVIEW
FOR EACH ROW
BEGIN
    DECLARE loc_id INT;
    SELECT locID INTO loc_id FROM FEEDBACK WHERE fbID = NEW.reviewID;
    IF loc_id IS NOT NULL THEN
        CALL sp_update_location_rating(loc_id);
    END IF;
END$$

DROP TRIGGER IF EXISTS trg_after_review_update$$
CREATE TRIGGER trg_after_review_update
AFTER UPDATE ON REVIEW
FOR EACH ROW
BEGIN
    DECLARE loc_id INT;
    IF OLD.ratingPoints != NEW.ratingPoints THEN
        SELECT locID INTO loc_id FROM FEEDBACK WHERE fbID = NEW.reviewID;
        IF loc_id IS NOT NULL THEN
            CALL sp_update_location_rating(loc_id);
        END IF;
    END IF;
END$$

-- Cần trigger BEFORE DELETE để lấy locID
DROP TRIGGER IF EXISTS trg_before_review_delete_for_rating$$
CREATE TRIGGER trg_before_review_delete_for_rating
BEFORE DELETE ON REVIEW
FOR EACH ROW
BEGIN
    -- Lưu locID vào 1 biến session để trigger AFTER DELETE có thể dùng
    SELECT locID INTO @locID_to_update_rating 
    FROM FEEDBACK 
    WHERE fbID = OLD.reviewID;
END$$

DROP TRIGGER IF EXISTS trg_after_review_delete$$
CREATE TRIGGER trg_after_review_delete
AFTER DELETE ON REVIEW
FOR EACH ROW
BEGIN
    IF @locID_to_update_rating IS NOT NULL THEN
        CALL sp_update_location_rating(@locID_to_update_rating);
        SET @locID_to_update_rating = NULL; -- Xóa biến
    END IF;
END$$


-- ---
-- TRIGGER 5.3: CẬP NHẬT TỔNG CHI TIÊU VÀ HẠNG CỦA DU KHÁCH
-- ---

-- Khi thanh toán (TRANSACTION) được xác nhận
DROP TRIGGER IF EXISTS trg_after_transaction_completed$$
CREATE TRIGGER trg_after_transaction_completed
AFTER UPDATE ON `TRANSACTION`
FOR EACH ROW
BEGIN
    DECLARE res_touristID INT;
    
    -- Nếu thanh toán thành công
    IF NEW.status = 'COMPLETED' AND OLD.status != 'COMPLETED' THEN
        
        -- Cập nhật totalPaid trong RESERVATION
        UPDATE RESERVATION
        SET totalPaid = totalPaid + NEW.paidAmount
        WHERE reservationID = NEW.reservationID;
        
        -- Lấy touristID
        SELECT touristID INTO res_touristID
        FROM RESERVATION
        WHERE reservationID = NEW.reservationID;
        
        -- Cập nhật totalSpent trong TOURIST
        IF res_touristID IS NOT NULL THEN
            UPDATE TOURIST
            SET totalSpent = totalSpent + NEW.paidAmount
            WHERE touristID = res_touristID;
        END IF;
    END IF;
END$$

-- Sau khi totalSpent thay đổi, cập nhật Hạng
DROP TRIGGER IF EXISTS trg_after_tourist_spent_update_rank$$
CREATE TRIGGER trg_after_tourist_spent_update_rank
AFTER UPDATE ON TOURIST
FOR EACH ROW
BEGIN
    -- Chỉ chạy nếu totalSpent thay đổi
    IF OLD.totalSpent != NEW.totalSpent THEN
        -- Gọi hàm fn_get_tourist_rank
        UPDATE TOURIST
        SET rankLevel = fn_get_tourist_rank(NEW.touristID)
        WHERE touristID = NEW.touristID;
    END IF;
END$$

-- ---
-- TRIGGER 5.4: RÀNG BUỘC NGHIỆP VỤ (TỪ BTL1)
-- ---

-- Ràng buộc: Chỉ được REVIEW khi đã 'COMPLETED' đơn hàng
DROP TRIGGER IF EXISTS trg_before_review_insert_check_completed$$
CREATE TRIGGER trg_before_review_insert_check_completed
BEFORE INSERT ON FEEDBACK
FOR EACH ROW
BEGIN
    DECLARE tourist_id INT;
    DECLARE completed_reservations INT;

    IF NEW.feedbackType = 'REVIEW' THEN
        SELECT touristID INTO tourist_id 
        FROM TOURIST 
        WHERE touristID = NEW.userID;

        IF tourist_id IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Chỉ Du khách (TOURIST) mới có thể viết đánh giá.';
        END IF;

        -- Ràng buộc 1: Mỗi du khách chỉ được đánh giá 1 lần cho 1 địa điểm
        IF EXISTS (SELECT 1 FROM FEEDBACK WHERE userID = NEW.userID AND locID = NEW.locID AND feedbackType = 'REVIEW') THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Bạn đã đánh giá địa điểm này rồi.';
        END IF;

        SELECT COUNT(*) INTO completed_reservations
        FROM RESERVATION R
        JOIN BOOKING_DETAILS BD ON R.reservationID = BD.reservationID
        JOIN LOCATION_HAS_PRODUCT LHP ON BD.productID = LHP.productID
        WHERE R.touristID = tourist_id
          AND LHP.locID = NEW.locID
          AND R.status = 'COMPLETED';

        IF completed_reservations = 0 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Lỗi: Bạn phải hoàn thành một chuyến đi tại địa điểm này trước khi đánh giá.';
        END IF;
    END IF;
END$$

-- Ràng buộc: Kiểm tra VOUCHER hợp lệ khi đặt hàng
DROP TRIGGER IF EXISTS trg_check_voucher_validity$$
CREATE TRIGGER trg_check_voucher_validity
BEFORE INSERT ON RESERVATION
FOR EACH ROW
BEGIN
    DECLARE v_expDate DATE;
    DECLARE v_startDate DATE;
    DECLARE v_rank INT;
    DECLARE v_remaining INT;
    DECLARE u_rank VARCHAR(50);
    DECLARE u_rank_int INT;

    IF NEW.voucherID IS NOT NULL THEN
        -- Lấy thông tin voucher
        SELECT expDate, startDate, rankRequirement, (slots - used_slots)
        INTO v_expDate, v_startDate, v_rank, v_remaining
        FROM VOUCHER
        WHERE voucherID = NEW.voucherID;
        
        -- Lấy thông tin rank user
        SELECT rankLevel INTO u_rank_int FROM TOURIST WHERE touristID = NEW.touristID;

        -- Kiểm tra
        IF v_expDate IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Mã voucher không tồn tại.';
        ELSEIF CURDATE() > v_expDate THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Voucher đã hết hạn sử dụng.';
        ELSEIF CURDATE() < v_startDate THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Voucher chưa đến ngày sử dụng.';
        ELSEIF v_remaining <= 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Voucher đã hết lượt sử dụng.';
        ELSEIF u_rank_int < v_rank THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Bạn không đủ hạng thành viên để dùng voucher này.';
        END IF;
    END IF;
END$$

-- ---
-- TRIGGER 5.5: CẬP NHẬT SỐ LƯỢNG VOUCHER KHI SỬ DỤNG
-- ---
DROP TRIGGER IF EXISTS trg_use_voucher_slot$$
CREATE TRIGGER trg_use_voucher_slot
AFTER INSERT ON RESERVATION
FOR EACH ROW
BEGIN
    -- Nếu đơn hàng tạo thành công VÀ có dùng voucher
    IF NEW.voucherID IS NOT NULL THEN
        UPDATE VOUCHER
        SET used_slots = used_slots + 1
        WHERE voucherID = NEW.voucherID;
    END IF;
END$$

-- ---
-- TRIGGER 5.6: CẬP NHẬT TỰ ĐỘNG TỔNG TIỀN (totalAmount)
-- ---
DROP TRIGGER IF EXISTS trg_after_booking_details_insert$$
CREATE TRIGGER trg_after_booking_details_insert
AFTER INSERT ON BOOKING_DETAILS
FOR EACH ROW
BEGIN
    UPDATE RESERVATION
    SET totalAmount = fn_calculate_reservation_total(NEW.reservationID),
        numOfItems = (SELECT COUNT(*) FROM BOOKING_DETAILS WHERE reservationID = NEW.reservationID)
    WHERE reservationID = NEW.reservationID;
END$$

DROP TRIGGER IF EXISTS trg_after_booking_details_update$$
CREATE TRIGGER trg_after_booking_details_update
AFTER UPDATE ON BOOKING_DETAILS
FOR EACH ROW
BEGIN
    -- Cập nhật cho cả đơn hàng cũ và mới nếu reservationID thay đổi
    UPDATE RESERVATION
    SET totalAmount = fn_calculate_reservation_total(OLD.reservationID)
    WHERE reservationID = OLD.reservationID;
    
    UPDATE RESERVATION
    SET totalAmount = fn_calculate_reservation_total(NEW.reservationID)
    WHERE reservationID = NEW.reservationID;
END$$

DROP TRIGGER IF EXISTS trg_after_booking_details_delete$$
CREATE TRIGGER trg_after_booking_details_delete
AFTER DELETE ON BOOKING_DETAILS
FOR EACH ROW
BEGIN
    UPDATE RESERVATION
    SET totalAmount = fn_calculate_reservation_total(OLD.reservationID),
        numOfItems = (SELECT COUNT(*) FROM BOOKING_DETAILS WHERE reservationID = OLD.reservationID)
    WHERE reservationID = OLD.reservationID;
END$$


DELIMITER ;
DELIMITER $$

-- Tạo một thủ tục tạm thời để sửa tất cả rating
CREATE PROCEDURE sp_fix_all_location_ratings()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE loc_id INT;
    
    -- Khai báo con trỏ để lặp qua TẤT CẢ các địa điểm
    DECLARE loc_cursor CURSOR FOR 
        SELECT locID FROM LOCATION;
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN loc_cursor;
    
    read_loop: LOOP
        FETCH loc_cursor INTO loc_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Gọi lại Stored Procedure tính rating (từ BTL2) cho từng địa điểm
        -- Điều này đảm bảo logic được tái sử dụng
        CALL sp_update_location_rating(loc_id);
        
    END LOOP;
    
    CLOSE loc_cursor;
    
    SELECT 'Tất cả rating đã được cập nhật.' AS 'Message';
END$$

DELIMITER ;

-- 1. Chạy thủ tục này 1 LẦN DUY NHẤT
CALL sp_fix_all_location_ratings();

-- 2. Xóa thủ tục tạm thời này đi
DROP PROCEDURE sp_fix_all_location_ratings;


SHOW TRIGGERS FROM VIVUVIET;USE VIVUVIET;

-- BƯỚC 1: Xóa TẤT CẢ các trigger "Like" bị trùng lặp
DROP TRIGGER IF EXISTS trg_After_Like_Insert;
DROP TRIGGER IF EXISTS trg_after_like_update_count;
DROP TRIGGER IF EXISTS trg_After_Like_Delete;
DROP TRIGGER IF EXISTS trg_after_dislike_update_count;

-- BƯỚC 2: Tạo lại Trigger CHUẨN cho việc THÊM (Like)
DELIMITER $$
CREATE TRIGGER trg_after_like_insert
AFTER INSERT ON FB_LIKES
FOR EACH ROW
BEGIN
    UPDATE FEEDBACK
    SET likeCount = likeCount + 1
    WHERE fbID = NEW.fbID;
END$$
DELIMITER ;

-- BƯỚC 3: Tạo lại Trigger CHUẨN cho việc XÓA (Unlike)
DELIMITER $$
CREATE TRIGGER trg_after_like_delete
AFTER DELETE ON FB_LIKES
FOR EACH ROW
BEGIN
    UPDATE FEEDBACK
    SET likeCount = likeCount - 1
    WHERE fbID = OLD.fbID;
END$$
DELIMITER ;

-- BƯỚC 4: Tạo thủ tục tạm thời để SỬA LỖI "Like = 0"
DELIMITER $$
CREATE PROCEDURE sp_fix_all_like_counts()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE fb_id INT;
    DECLARE likes_count INT;
    
    -- Con trỏ lặp qua TẤT CẢ feedback
    DECLARE fb_cursor CURSOR FOR 
        SELECT fbID FROM FEEDBACK;
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN fb_cursor;
    
    read_loop: LOOP
        FETCH fb_cursor INTO fb_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Đếm số like thực tế từ bảng FB_LIKES
        SELECT COUNT(*) INTO likes_count 
        FROM FB_LIKES 
        WHERE fbID = fb_id;
        
        -- Cập nhật lại cột likeCount trong bảng FEEDBACK
        UPDATE FEEDBACK 
        SET likeCount = likes_count 
        WHERE fbID = fb_id;
        
    END LOOP;
    
    CLOSE fb_cursor;
    
    SELECT 'Tất cả likeCount đã được đồng bộ hóa.' AS Message;
END$$
DELIMITER ;

-- BƯỚC 5: CHẠY LẠI ĐỒNG BỘ (Quan trọng nhất)
CALL sp_fix_all_like_counts();

-- BƯỚC 6: Xóa thủ tục tạm
DROP PROCEDURE sp_fix_all_like_counts;

/*
================================================================
 7. TRIGGER BỔ SUNG: KIỂM TRA TUỔI (Thay thế CHECK CONSTRAINT)
================================================================
*/
DELIMITER $$

DROP TRIGGER IF EXISTS trg_before_user_insert_check_age$$
CREATE TRIGGER trg_before_user_insert_check_age
BEFORE INSERT ON USER_ACCOUNT
FOR EACH ROW
BEGIN
    IF NEW.DOB IS NOT NULL AND TIMESTAMPDIFF(YEAR, NEW.DOB, CURDATE()) < 18 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Người dùng phải đủ 18 tuổi.';
    END IF;
END$$

DROP TRIGGER IF EXISTS trg_before_user_update_check_age$$
CREATE TRIGGER trg_before_user_update_check_age
BEFORE UPDATE ON USER_ACCOUNT
FOR EACH ROW
BEGIN
    IF NEW.DOB IS NOT NULL AND TIMESTAMPDIFF(YEAR, NEW.DOB, CURDATE()) < 18 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Người dùng phải đủ 18 tuổi.';
    END IF;
END$$

DELIMITER ;