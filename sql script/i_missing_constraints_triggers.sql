/*
================================================================
 TRIGGERS BỔ SUNG - HOÀN THIỆN RÀNG BUỘC NGỮ NGHĨA
================================================================
 Bổ sung 2 ràng buộc còn thiếu:
 - #4: Vòng đời status Reservation
 - #8: Auto inactive location khi rating quá thấp
================================================================
*/

USE VIVUVIET;
DELIMITER $$

-- ================================================================
-- TRIGGER: Kiểm tra vòng đời status Reservation
-- ================================================================
-- RÀNG BUỘC #4: 
--   - PENDING → CONFIRMED → COMPLETED (OK)
--   - COMPLETED → CANCELLED (KHÔNG ĐƯỢC)
--   - CANCELLED → bất kỳ status nào (KHÔNG ĐƯỢC)
-- ================================================================
DROP TRIGGER IF EXISTS trg_before_reservation_status_update$$

CREATE TRIGGER trg_before_reservation_status_update
BEFORE UPDATE ON RESERVATION
FOR EACH ROW
BEGIN
    -- Chỉ kiểm tra khi status thay đổi
    IF OLD.status != NEW.status THEN
        
        -- 1. Không cho phép từ COMPLETED → CANCELLED
        IF OLD.status = 'COMPLETED' AND NEW.status = 'CANCELLED' THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Lỗi: Không thể hủy reservation đã hoàn thành.';
        END IF;
        
        -- 2. Không cho phép từ CANCELLED → bất kỳ status nào khác
        IF OLD.status = 'CANCELLED' AND NEW.status != 'CANCELLED' THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Lỗi: Không thể thay đổi reservation đã hủy.';
        END IF;
        
        -- 3. Không cho phép từ COMPLETED → PENDING hoặc CONFIRMED
        IF OLD.status = 'COMPLETED' AND NEW.status IN ('PENDING', 'CONFIRMED') THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Lỗi: Không thể đưa reservation đã hoàn thành về trạng thái trước đó.';
        END IF;
        
        -- 4. Optional: Validate transition logic (tuỳ business rules)
        -- PENDING chỉ có thể → CONFIRMED hoặc CANCELLED
        IF OLD.status = 'PENDING' AND NEW.status = 'COMPLETED' THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Lỗi: Reservation phải qua trạng thái CONFIRMED trước khi COMPLETED.';
        END IF;
        
    END IF;
END$$

-- ================================================================
-- TRIGGER: Auto set INACTIVE khi location có rating quá thấp
-- ================================================================
-- RÀNG BUỘC #8:
--   - Khi ratingPoints < 2.0 (đủ nhiều reviews)
--   - Tự động set status = 'INACTIVE' để admin xem xét lại
-- ================================================================
DROP TRIGGER IF EXISTS trg_after_location_rating_check_quality$$

CREATE TRIGGER trg_after_location_rating_check_quality
AFTER UPDATE ON LOCATION
FOR EACH ROW
BEGIN
    -- Chỉ xử lý khi ratingPoints thay đổi
    IF NEW.ratingPoints != OLD.ratingPoints THEN
        
        -- Nếu rating quá thấp (< 2.0) VÀ location đang ACTIVE → Chuyển sang INACTIVE
        -- Note: Trong thực tế nên kiểm tra thêm số reviews, nhưng schema không có cột totalReviews
        IF NEW.ratingPoints < 2.0 AND NEW.status = 'ACTIVE' THEN
            
            -- Set status = INACTIVE để admin review
            UPDATE LOCATION
            SET status = 'INACTIVE'
            WHERE locID = NEW.locID;
            
        END IF;
        
        -- Optional: Auto reactivate nếu rating cải thiện
        -- Nếu rating >= 3.0 VÀ location đang INACTIVE (do rating thấp) → PENDING
        IF NEW.ratingPoints >= 3.0 
           AND NEW.status = 'INACTIVE' 
           AND OLD.ratingPoints < 2.0 THEN
            
            -- Chuyển về PENDING để admin review và approve lại
            UPDATE LOCATION
            SET status = 'PENDING'
            WHERE locID = NEW.locID;
        END IF;
    END IF;
END$$

DELIMITER ;

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Test 1: Kiểm tra vòng đời status
-- Tạo reservation test:
-- INSERT INTO RESERVATION (..., status='PENDING') VALUES (...);
-- UPDATE RESERVATION SET status='CONFIRMED' WHERE ...; -- OK
-- UPDATE RESERVATION SET status='COMPLETED' WHERE ...; -- OK
-- UPDATE RESERVATION SET status='CANCELLED' WHERE ...; -- ERROR!

-- Test 2: Kiểm tra auto inactive
-- Giả sử location ID=1 có avgRating=1.8, totalReviews=12, status='ACTIVE'
-- Khi review mới được thêm làm rating còn < 2.0:
-- SELECT status FROM LOCATION WHERE locID=1; -- Sẽ thấy 'INACTIVE'

SELECT 'Triggers bổ sung đã được tạo thành công!' as message;
SELECT 'Ràng buộc #4 (vòng đời status) và #8 (auto inactive) đã hoàn thiện' as info;
