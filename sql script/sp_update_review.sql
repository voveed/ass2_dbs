DELIMITER $$

DROP PROCEDURE IF EXISTS sp_update_review$$
CREATE PROCEDURE sp_update_review(
    IN p_reviewID INT,
    IN p_userID INT,
    IN p_rating INT,
    IN p_content TEXT
)
BEGIN
    DECLARE v_exists INT;

    -- Check if review exists and belongs to user
    SELECT COUNT(*) INTO v_exists
    FROM FEEDBACK
    WHERE fbID = p_reviewID AND userID = p_userID AND feedbackType = 'REVIEW';

    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Đánh giá không tồn tại hoặc không thuộc về bạn.';
    END IF;

    -- Update Rating
    UPDATE REVIEW
    SET ratingPoints = p_rating
    WHERE reviewID = p_reviewID;

    -- Update Comment Content
    -- Note: A review might not always have a comment record if it was rating-only initially,
    -- but usually they go together. If not, we might need to INSERT.
    -- For now, assuming 1-1 mapping as per sp_add_review logic.
    UPDATE COMMENT
    SET content = p_content
    WHERE commentID = p_reviewID;

    -- If comment didn't exist (e.g. rating only), insert it?
    -- Checking if row affected. If 0, insert.
    IF ROW_COUNT() = 0 THEN
        INSERT INTO COMMENT (commentID, content) VALUES (p_reviewID, p_content);
    END IF;
    
    -- Update timestamp to now?
    UPDATE FEEDBACK SET fbDateTime = NOW() WHERE fbID = p_reviewID;

END$$

DELIMITER ;
