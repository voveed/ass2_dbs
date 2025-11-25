-- ================================================================
-- VIVUVIET DATABASE - TRIỂN KHAI HOÀN CHỈNH
-- ================================================================
-- Mục đích: Tạo lại toàn bộ database với đầy đủ:
--   - 35 bảng
--   - Triggers, Functions, Procedures
--   - Dữ liệu mẫu (≥5 dòng/bảng)
-- ================================================================
-- Hướng dẫn:
--   1. Mở MySQL Workbench
--   2. File → Open SQL Script → Chọn file này
--   3. Execute (Ctrl+Shift+Enter)
--   4. Đợi ~30-60 giây
--   5. Kiểm tra: SELECT COUNT(*) FROM LOCATION;
-- ================================================================

-- BƯỚC 0: Dọn dẹp (nếu database đã tồn tại)
DROP DATABASE IF EXISTS VIVUVIET;

-- ================================================================
-- BƯỚC 1: TẠO SCHEMA (35 BẢNG)
-- ================================================================

SOURCE a_create_table.sql;

-- ================================================================
-- BƯỚC 2: TẠO TRIGGERS & FUNCTIONS CƠ BẢN
-- ================================================================

SOURCE b_trigger_func_proc.sql;

-- ================================================================
-- BƯỚC 3: TẠO STORED PROCEDURES CHÍNH (LOCATION CRUD)
-- ================================================================

SOURCE d_enhanced_procedures_fixed.sql;

-- ================================================================
-- BƯỚC 4: TẠO SP QUẢN LÝ MỐI QUAN HỆ (PREFERENCES, PRODUCTS)
-- ================================================================

SOURCE e_location_relationships_sp.sql;

-- ================================================================
-- BƯỚC 5: TẠO SP QUẢN LÝ ẢNH & TIỆN ÍCH
-- ================================================================

SOURCE f_update_image_utility_sp.sql;

-- ================================================================
-- BƯỚC 6: INSERT DỮ LIỆU MẪU
-- ================================================================

SOURCE g_insert_data.sql;

-- ================================================================
-- BƯỚC 7: TẠO SP RESTORE (KHÔI PHỤC ĐỊA ĐIỂM)
-- ================================================================

SOURCE sp_restore_location.sql;

-- ================================================================
-- BƯỚC 8: TẠO SP HARD DELETE (XÓA VĨNH VIỄN)
-- ================================================================

SOURCE sp_hard_delete_location.sql;

-- ================================================================
-- COMPLETED! 
-- ================================================================

-- Kiểm tra kết quả
SELECT '✅ Database VIVUVIET đã được tạo thành công!' AS Status;

SELECT 
    'Tables' as Type, 
    COUNT(*) as Count 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'VIVUVIET'

UNION ALL

SELECT 
    'Stored Procedures', 
    COUNT(*) 
FROM INFORMATION_SCHEMA.ROUTINES 
WHERE ROUTINE_SCHEMA = 'VIVUVIET' 
AND ROUTINE_TYPE = 'PROCEDURE'

UNION ALL

SELECT 
    'Triggers', 
    COUNT(*) 
FROM INFORMATION_SCHEMA.TRIGGERS 
WHERE TRIGGER_SCHEMA = 'VIVUVIET';

-- Kiểm tra dữ liệu
SELECT 'LOCATION' as TableName, COUNT(*) as RowCount FROM LOCATION
UNION ALL
SELECT 'USER_ACCOUNT', COUNT(*) FROM USER_ACCOUNT
UNION ALL
SELECT 'TOURIST', COUNT(*) FROM TOURIST
UNION ALL
SELECT 'BUSINESS_OWNER', COUNT(*) FROM BUSINESS_OWNER
UNION ALL
SELECT 'RESERVATION', COUNT(*) FROM RESERVATION;
