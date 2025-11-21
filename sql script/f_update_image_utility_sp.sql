/*
================================================================
 VIVUVIET - UPDATE STORED PROCEDURES FOR IMAGES & UTILITIES
================================================================
*/

USE VIVUVIET;
DELIMITER $$

-- Update Image Caption
DROP PROCEDURE IF EXISTS sp_update_image_caption$$
CREATE PROCEDURE sp_update_image_caption(
    IN p_imageID INT,
    IN p_caption VARCHAR(500),
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(500)
)
BEGIN
    DECLARE img_exists INT;
    
    SET p_success = FALSE;
    
    SELECT COUNT(*) INTO img_exists FROM IMAGE WHERE imageID = p_imageID;
    
    IF img_exists = 0 THEN
        SET p_message = 'Lỗi: Hình ảnh không tồn tại.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Image not found';
    END IF;
    
    UPDATE IMAGE SET caption = p_caption WHERE imageID = p_imageID;
    
    SET p_success = TRUE;
    SET p_message = 'Cập nhật mô tả hình ảnh thành công!';
END$$

-- Update Utility
DROP PROCEDURE IF EXISTS sp_update_utility$$
CREATE PROCEDURE sp_update_utility(
    IN p_utilityID INT,
    IN p_uName VARCHAR(255),
    IN p_uType VARCHAR(100),
    IN p_UDescription TEXT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(500)
)
BEGIN
    DECLARE util_exists INT;
    
    SET p_success = FALSE;
    
    SELECT COUNT(*) INTO util_exists FROM UTILITY WHERE utility = p_utilityID;
    
    IF util_exists = 0 THEN
        SET p_message = 'Lỗi: Tiện ích không tồn tại.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Utility not found';
    END IF;
    
    UPDATE UTILITY
    SET uName = COALESCE(p_uName, uName),
        uType = COALESCE(p_uType, uType),
        UDescription = COALESCE(p_UDescription, UDescription)
    WHERE utility = p_utilityID;
    
    SET p_success = TRUE;
    SET p_message = 'Cập nhật tiện ích thành công!';
END$$

DELIMITER ;
