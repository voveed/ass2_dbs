/*
================================================================
 VIVUVIET - PREFERENCE & PRODUCT MANAGEMENT STORED PROCEDURES
 For managing Location-Preference and Location-Product relationships
================================================================
*/

USE VIVUVIET;
DELIMITER $$

-- ================================================================
-- PREFERENCE MANAGEMENT
-- ================================================================

-- 1. Add Preference to Location
DROP PROCEDURE IF EXISTS sp_add_location_preference$$
CREATE PROCEDURE sp_add_location_preference(
    IN p_locID INT,
    IN p_prefID INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(500)
)
BEGIN
    DECLARE loc_exists INT;
    DECLARE pref_exists INT;
    DECLARE already_linked INT;
    
    SET p_success = FALSE;
    
    -- Check location exists
    SELECT COUNT(*) INTO loc_exists
    FROM LOCATION WHERE locID = p_locID;
    
    IF loc_exists = 0 THEN
        SET p_message = 'Lỗi: Địa điểm không tồn tại.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Location not found';
    END IF;
    
    -- Check preference exists
    SELECT COUNT(*) INTO pref_exists
    FROM PREFERENCE WHERE prefID = p_prefID;
    
    IF pref_exists = 0 THEN
        SET p_message = 'Lỗi: Preference không tồn tại.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Preference not found';
    END IF;
    
    -- Check if already linked
    SELECT COUNT(*) INTO already_linked
    FROM LOCATION_HAS_PREFERENCE
    WHERE locID = p_locID AND prefID = p_prefID;
    
    IF already_linked > 0 THEN
        SET p_message = 'Lỗi: Preference đã được thêm cho địa điểm này.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Already linked';
    END IF;
    
    -- Add link
    INSERT INTO LOCATION_HAS_PREFERENCE (locID, prefID)
    VALUES (p_locID, p_prefID);
    
    SET p_success = TRUE;
    SET p_message = 'Thêm preference thành công!';
END$$

-- 2. Remove Preference from Location
DROP PROCEDURE IF EXISTS sp_remove_location_preference$$
CREATE PROCEDURE sp_remove_location_preference(
    IN p_locID INT,
    IN p_prefID INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(500)
)
BEGIN
    DECLARE link_exists INT;
    
    SET p_success = FALSE;
    
    -- Check if link exists
    SELECT COUNT(*) INTO link_exists
    FROM LOCATION_HAS_PREFERENCE
    WHERE locID = p_locID AND prefID = p_prefID;
    
    IF link_exists = 0 THEN
        SET p_message = 'Lỗi: Preference không liên kết với địa điểm này.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Link not found';
    END IF;
    
    -- Remove link
    DELETE FROM LOCATION_HAS_PREFERENCE
    WHERE locID = p_locID AND prefID = p_prefID;
    
    SET p_success = TRUE;
    SET p_message = 'Xóa preference thành công!';
END$$

-- 3. Get all Preferences for a Location
DROP PROCEDURE IF EXISTS sp_get_location_preferences$$
CREATE PROCEDURE sp_get_location_preferences(IN p_locID INT)
BEGIN
    SELECT 
        P.prefID,
        P.prefName,
        P.category,
        P.prefDescription
    FROM PREFERENCE P
    INNER JOIN LOCATION_HAS_PREFERENCE LHP ON P.prefID = LHP.prefID
    WHERE LHP.locID = p_locID
    ORDER BY P.category, P.prefName;
END$$

-- 4. Get all available Preferences (for selection)
DROP PROCEDURE IF EXISTS sp_get_all_preferences$$
CREATE PROCEDURE sp_get_all_preferences()
BEGIN
    SELECT prefID, prefName, category, prefDescription
    FROM PREFERENCE
    ORDER BY category, prefName;
END$$

-- ================================================================
-- PRODUCT MANAGEMENT
-- ================================================================

-- 5. Add Product to Location
DROP PROCEDURE IF EXISTS sp_add_location_product$$
CREATE PROCEDURE sp_add_location_product(
    IN p_locID INT,
    IN p_productID INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(500)
)
BEGIN
    DECLARE loc_exists INT;
    DECLARE prod_exists INT;
    DECLARE already_linked INT;
    
    SET p_success = FALSE;
    
    -- Check location exists
    SELECT COUNT(*) INTO loc_exists
    FROM LOCATION WHERE locID = p_locID;
    
    IF loc_exists = 0 THEN
        SET p_message = 'Lỗi: Địa điểm không tồn tại.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Location not found';
    END IF;
    
    -- Check product exists
    SELECT COUNT(*) INTO prod_exists
    FROM PRODUCT WHERE productID = p_productID;
    
    IF prod_exists = 0 THEN
        SET p_message = 'Lỗi: Product không tồn tại.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product not found';
    END IF;
    
    -- Check if already linked
    SELECT COUNT(*) INTO already_linked
    FROM LOCATION_HAS_PRODUCT
    WHERE locID = p_locID AND productID = p_productID;
    
    IF already_linked > 0 THEN
        SET p_message = 'Lỗi: Product đã được thêm cho địa điểm này.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Already linked';
    END IF;
    
    -- Add link
    INSERT INTO LOCATION_HAS_PRODUCT (locID, productID)
    VALUES (p_locID, p_productID);
    
    SET p_success = TRUE;
    SET p_message = 'Thêm product thành công!';
END$$

-- 6. Create new Product and link to Location
DROP PROCEDURE IF EXISTS sp_create_and_add_product$$
CREATE PROCEDURE sp_create_and_add_product(
    IN p_locID INT,
    IN p_productName VARCHAR(255),
    IN p_category VARCHAR(100),
    IN p_basePrice DECIMAL(18,2),
    IN p_pricingUnit VARCHAR(50),
    IN p_description TEXT,
    OUT p_productID INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(500)
)
BEGIN
    DECLARE loc_exists INT;
    
    SET p_success = FALSE;
    SET p_productID = NULL;
    
    -- Validate location
    SELECT COUNT(*) INTO loc_exists
    FROM LOCATION WHERE locID = p_locID;
    
    IF loc_exists = 0 THEN
        SET p_message = 'Lỗi: Địa điểm không tồn tại.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Location not found';
    END IF;
    
    -- Validate product name
    IF p_productName IS NULL OR TRIM(p_productName) = '' THEN
        SET p_message = 'Lỗi: Tên product không được để trống.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product name required';
    END IF;
    
    -- Validate category
    IF p_category NOT IN ('ROOMTYPE', 'TABLE_TYPE', 'TICKET_TYPE') THEN
        SET p_message = 'Lỗi: Category phải là ROOMTYPE, TABLE_TYPE hoặc TICKET_TYPE.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid category';
    END IF;
    
    -- Validate basePrice
    IF p_basePrice < 0 THEN
        SET p_message = 'Lỗi: Giá phải >= 0.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid price';
    END IF;
    
    -- Create product
    INSERT INTO PRODUCT (productName, category, basePrice, pricingUnit, description)
    VALUES (p_productName, p_category, p_basePrice, p_pricingUnit, p_description);
    
    SET p_productID = LAST_INSERT_ID();
    
    -- Link to location
    INSERT INTO LOCATION_HAS_PRODUCT (locID, productID)
    VALUES (p_locID, p_productID);
    
    SET p_success = TRUE;
    SET p_message = 'Tạo và thêm product thành công!';
END$$

-- 7. Update Product (price/name/description)
DROP PROCEDURE IF EXISTS sp_update_product$$
CREATE PROCEDURE sp_update_product(
    IN p_productID INT,
    IN p_productName VARCHAR(255),
    IN p_basePrice DECIMAL(18,2),
    IN p_pricingUnit VARCHAR(50),
    IN p_description TEXT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(500)
)
BEGIN
    DECLARE prod_exists INT;
    
    SET p_success = FALSE;
    
    -- Check product exists
    SELECT COUNT(*) INTO prod_exists
    FROM PRODUCT WHERE productID = p_productID;
    
    IF prod_exists = 0 THEN
        SET p_message = 'Lỗi: Product không tồn tại.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product not found';
    END IF;
    
    -- Validate basePrice if provided
    IF p_basePrice IS NOT NULL AND p_basePrice < 0 THEN
        SET p_message = 'Lỗi: Giá phải >= 0.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid price';
    END IF;
    
    -- Update
    UPDATE PRODUCT
    SET productName = COALESCE(p_productName, productName),
        basePrice = COALESCE(p_basePrice, basePrice),
        pricingUnit = COALESCE(p_pricingUnit, pricingUnit),
        description = COALESCE(p_description, description)
    WHERE productID = p_productID;
    
    SET p_success = TRUE;
    SET p_message = 'Cập nhật product thành công!';
END$$

-- 8. Remove Product from Location
DROP PROCEDURE IF EXISTS sp_remove_location_product$$
CREATE PROCEDURE sp_remove_location_product(
    IN p_locID INT,
    IN p_productID INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(500)
)
BEGIN
    DECLARE link_exists INT;
    DECLARE has_bookings INT;
    
    SET p_success = FALSE;
    
    -- Check if link exists
    SELECT COUNT(*) INTO link_exists
    FROM LOCATION_HAS_PRODUCT
    WHERE locID = p_locID AND productID = p_productID;
    
    IF link_exists = 0 THEN
        SET p_message = 'Lỗi: Product không liên kết với địa điểm này.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Link not found';
    END IF;
    
    -- Check for existing bookings
    SELECT COUNT(*) INTO has_bookings
    FROM BOOKING_DETAILS
    WHERE productID = p_productID;
    
    IF has_bookings > 0 THEN
        SET p_message = 'Lỗi: Không thể xóa product đang có bookings. Vui lòng chỉ deactivate.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product has bookings';
    END IF;
    
    -- Remove link
    DELETE FROM LOCATION_HAS_PRODUCT
    WHERE locID = p_locID AND productID = p_productID;
    
    SET p_success = TRUE;
    SET p_message = 'Xóa product thành công!';
END$$

-- 9. Get all Products for a Location
DROP PROCEDURE IF EXISTS sp_get_location_products$$
CREATE PROCEDURE sp_get_location_products(IN p_locID INT)
BEGIN
    SELECT 
        P.productID,
        P.productName,
        P.category,
        P.basePrice,
        P.pricingUnit,
        P.description,
        (SELECT COUNT(*) FROM PRODUCT_HAS_IMAGE PHI 
         WHERE PHI.productID = P.productID) as imageCount
    FROM PRODUCT P
    INNER JOIN LOCATION_HAS_PRODUCT LHP ON P.productID = LHP.productID
    WHERE LHP.locID = p_locID
    ORDER BY P.category, P.productName;
END$$

DELIMITER ;

-- ================================================================
-- TEST CASES
-- ================================================================

-- Test Preference Management
-- CALL sp_add_location_preference(1, 1, @s, @m); SELECT @s, @m;
-- CALL sp_get_location_preferences(1);
-- CALL sp_remove_location_preference(1, 1, @s, @m); SELECT @s, @m;

-- Test Product Management
-- CALL sp_create_and_add_product(1, 'Phòng Deluxe', 'ROOMTYPE', 1500000, 'night', 'Phòng cao cấp view biển', @pid, @s, @m); SELECT @pid, @s, @m;
-- CALL sp_get_location_products(1);
-- CALL sp_update_product(1, 'Phòng Deluxe Premium', 1800000, NULL, NULL, @s, @m); SELECT @s, @m;
-- CALL sp_remove_location_product(1, 1, @s, @m); SELECT @s, @m;
