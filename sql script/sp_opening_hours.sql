DELIMITER $$

-- 1. Get Opening Hours
DROP PROCEDURE IF EXISTS sp_get_location_opening_hours$$
CREATE PROCEDURE sp_get_location_opening_hours(
    IN p_locID INT
)
BEGIN
    SELECT dayOfWeek, openTime, closeTime
    FROM LOCATION_OPENING_HOURS
    WHERE locID = p_locID
    ORDER BY dayOfWeek, openTime;
END$$

-- 2. Add Opening Hour
DROP PROCEDURE IF EXISTS sp_add_location_opening_hour$$
CREATE PROCEDURE sp_add_location_opening_hour(
    IN p_locID INT,
    IN p_dayOfWeek INT,
    IN p_openTime TIME,
    IN p_closeTime TIME
)
BEGIN
    -- Validate inputs
    IF p_dayOfWeek < 0 OR p_dayOfWeek > 6 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Ngày trong tuần không hợp lệ (0-6).';
    END IF;

    IF p_closeTime <= p_openTime THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Giờ đóng cửa phải sau giờ mở cửa.';
    END IF;

    -- Check for overlap (optional but good practice)
    IF EXISTS (
        SELECT 1 FROM LOCATION_OPENING_HOURS
        WHERE locID = p_locID
          AND dayOfWeek = p_dayOfWeek
          AND (
            (p_openTime >= openTime AND p_openTime < closeTime) OR
            (p_closeTime > openTime AND p_closeTime <= closeTime) OR
            (p_openTime <= openTime AND p_closeTime >= closeTime)
          )
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Khung giờ bị trùng lặp.';
    END IF;

    INSERT INTO LOCATION_OPENING_HOURS (locID, dayOfWeek, openTime, closeTime)
    VALUES (p_locID, p_dayOfWeek, p_openTime, p_closeTime);
END$$

-- 3. Delete Opening Hour
DROP PROCEDURE IF EXISTS sp_delete_location_opening_hour$$
CREATE PROCEDURE sp_delete_location_opening_hour(
    IN p_locID INT,
    IN p_dayOfWeek INT,
    IN p_openTime TIME,
    IN p_closeTime TIME
)
BEGIN
    DELETE FROM LOCATION_OPENING_HOURS
    WHERE locID = p_locID
      AND dayOfWeek = p_dayOfWeek
      AND openTime = p_openTime
      AND closeTime = p_closeTime;
END$$

DELIMITER ;
