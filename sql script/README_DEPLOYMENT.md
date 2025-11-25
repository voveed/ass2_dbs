# 📚 HƯỚNG DẪN TRIỂN KHAI DATABASE - BTL2 HỆ CSDL

## 🎯 MỤC ĐÍCH
Tài liệu này hướng dẫn triển khai **HOÀN CHỈNH** cơ sở dữ liệu VIVUVIET Database theo yêu cầu BTL2, bao gồm:
- ✅ 35 bảng với đầy đủ ràng buộc
- ✅ Triggers, Functions, Procedures
- ✅ Dữ liệu mẫu (ít nhất 5 dòng/bảng)

---

## 📋 DANH SÁCH FILES SQL

### File Bắt Buộc (Chạy Theo Thứ Tự)

| STT | File Name | Mô Tả | Nội Dung Chính |
|-----|-----------|-------|----------------|
| 1️⃣ | `a_create_table.sql` | Tạo schema | 35 bảng + constraints (PK, FK, CHECK) |
| 2️⃣ | `b_trigger_func_proc.sql` | Triggers & Functions cơ bản | Triggers tính toán, validation |
| 3️⃣ | `d_enhanced_procedures_fixed.sql` | Stored Procedures nâng cao | sp_add/update/delete_location, sp_get_* |
| 4️⃣ | `e_location_relationships_sp.sql` | SP quản lý quan hệ | sp_add/remove_location_preference/product |
| 5️⃣ | `f_update_image_utility_sp.sql` | SP quản lý ảnh & tiện ích | sp_add/update/delete_location_image/utility |
| 6️⃣ | `g_insert_data.sql` | Dữ liệu mẫu | 30 locations, 20 tourists, 10 reservations... |

### File Phụ Trợ (Tùy Chọn)

| File Name | Mục Đích |
|-----------|----------|
| `c_enhanced_procedures.sql` | ⚠️ Deprecated - Dùng file `d_*` thay thế |
| `fix_pricelev_constraint.sql` | 🔧 Fix khi update từ version cũ |
| `voucher_status_view.sql` | 📊 View bổ sung (không bắt buộc) |

---

## ⚡ CÁCH TRIỂN KHAI

### Phương Án 1: MySQL Workbench (Khuyến Nghị)

```sql
-- Bước 0: Drop database cũ (nếu có)
DROP DATABASE IF EXISTS VIVUVIET;

-- Bước 1-6: Chạy lần lượt từng file theo thứ tự
-- (Mở từng file và Execute - Ctrl+Shift+Enter)
```

**Thứ tự thực thi:**
1. Open `a_create_table.sql` → Execute (Ctrl+Shift+Enter)
2. Open `b_trigger_func_proc.sql` → Execute
3. Open `d_enhanced_procedures_fixed.sql` → Execute
4. Open `e_location_relationships_sp.sql` → Execute
5. Open `f_update_image_utility_sp.sql` → Execute
6. Open `g_insert_data.sql` → Execute

### Phương Án 2: Command Line

```bash
# Di chuyển vào thư mục chứa SQL scripts
cd "C:\Users\vovee\OneDrive\Desktop\VIVUVIET\sql script"

# Chạy tất cả theo thứ tự
mysql -u root -p < a_create_table.sql
mysql -u root -p VIVUVIET < b_trigger_func_proc.sql
mysql -u root -p VIVUVIET < d_enhanced_procedures_fixed.sql
mysql -u root -p VIVUVIET < e_location_relationships_sp.sql
mysql -u root -p VIVUVIET < f_update_image_utility_sp.sql
mysql -u root -p VIVUVIET < g_insert_data.sql
```

### Phương Án 3: Một Script Duy Nhất

Tạo file `deploy_all.sql`:

```sql
source a_create_table.sql;
source b_trigger_func_proc.sql;
source d_enhanced_procedures_fixed.sql;
source e_location_relationships_sp.sql;
source f_update_image_utility_sp.sql;
source g_insert_data.sql;
```

Chạy:
```bash
mysql -u root -p < deploy_all.sql
```

---

## ✅ KIỂM TRA SAU KHI TRIỂN KHAI

### 1. Kiểm tra số lượng bảng (phải có 35 bảng)

```sql
USE VIVUVIET;

SELECT COUNT(*) as total_tables 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'VIVUVIET';
-- Kết quả mong đợi: 35
```

### 2. Kiểm tra dữ liệu (ít nhất 5 dòng/bảng)

```sql
-- Kiểm tra LOCATION
SELECT COUNT(*) FROM LOCATION;  -- ≥ 30

-- Kiểm tra TOURIST
SELECT COUNT(*) FROM TOURIST;   -- ≥ 20

-- Kiểm tra RESERVATION
SELECT COUNT(*) FROM RESERVATION; -- ≥ 30
```

### 3. Kiểm tra Stored Procedures

```sql
SHOW PROCEDURE STATUS WHERE Db = 'VIVUVIET';
-- Phải có: sp_add_location, sp_update_location, sp_delete_location, 
--          sp_get_locations_by_owner, sp_get_owner_statistics, v.v.
```

### 4. Kiểm tra Triggers

```sql
SHOW TRIGGERS FROM VIVUVIET;
-- Phải có: trg_after_transaction_update, trg_after_tourist_spent_update_rank, v.v.
```

### 5. Kiểm tra Functions

```sql
SHOW FUNCTION STATUS WHERE Db = 'VIVUVIET';
-- Kiểm tra có các functions tính toán
```

### 6. Kiểm tra Constraints (Quan Trọng!)

```sql
-- Kiểm tra constraint priceLev đã đúng chưa
SELECT CONSTRAINT_NAME, CHECK_CLAUSE
FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS
WHERE CONSTRAINT_SCHEMA = 'VIVUVIET'
AND CONSTRAINT_NAME = 'CHK_LocationPriceLev';

-- Kết quả mong đợi:
-- CHECK (priceLev IS NULL OR priceLev IN ('BUDGET', 'MODERATE', 'UPSCALE', 'LUXURY'))
```

```sql
-- Kiểm tra dữ liệu priceLev
SELECT priceLev, COUNT(*) as count
FROM LOCATION
GROUP BY priceLev;

-- Kết quả mong đợi: chỉ có BUDGET, MODERATE, UPSCALE, LUXURY
-- KHÔNG có: Bình dân, Trung bình, Cao cấp, Xa xỉ
```

---

## 🔧 XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi 1: "Table already exists"

**Nguyên nhân:** Database đã tồn tại  
**Giải pháp:**
```sql
DROP DATABASE IF EXISTS VIVUVIET;
-- Sau đó chạy lại từ đầu
```

### Lỗi 2: "Check constraint violated"

**Nguyên nhân:** Dữ liệu không khớp với constraint  
**Giải pháp:**
- Đảm bảo đã sửa `g_insert_data.sql` với giá trị priceLev tiếng Anh
- Kiểm tra file đã được save chưa

### Lỗi 3: "Procedure already exists"

**Nguyên nhân:** Chạy script nhiều lần  
**Giải pháp:**
```sql
DROP PROCEDURE IF EXISTS sp_add_location;
DROP PROCEDURE IF EXISTS sp_update_location;
-- ... hoặc drop toàn bộ database và tạo lại
```

### Lỗi 4: Foreign Key Constraint Fails

**Nguyên nhân:** Thứ tự insert data sai  
**Giải pháp:**
- File `g_insert_data.sql` đã có `SET FOREIGN_KEY_CHECKS=0` ở đầu
- Đảm bảo chạy đúng thứ tự: USER → BUSINESS_OWNER → LOCATION

---

## 📊 THỐNG KÊ DATABASE SAU KHI HOÀN THÀNH

```sql
-- Script kiểm tra tổng quan
SELECT 
    'Tables' as Type, 
    COUNT(*) as Count 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'VIVUVIET'

UNION ALL

SELECT 
    'Procedures', 
    COUNT(*) 
FROM INFORMATION_SCHEMA.ROUTINES 
WHERE ROUTINE_SCHEMA = 'VIVUVIET' 
AND ROUTINE_TYPE = 'PROCEDURE'

UNION ALL

SELECT 
    'Functions', 
    COUNT(*) 
FROM INFORMATION_SCHEMA.ROUTINES 
WHERE ROUTINE_SCHEMA = 'VIVUVIET' 
AND ROUTINE_TYPE = 'FUNCTION'

UNION ALL

SELECT 
    'Triggers', 
    COUNT(*) 
FROM INFORMATION_SCHEMA.TRIGGERS 
WHERE TRIGGER_SCHEMA = 'VIVUVIET';
```

**Kết quả mong đợi:**

| Type | Count |
|------|-------|
| Tables | 35 |
| Procedures | ~15+ |
| Functions | ~3+ |
| Triggers | ~5+ |

---

## 🎓 YÊU CẦU BTL2 ĐÃ HOÀN THÀNH

### ✅ Phần 1: Tạo bảng và dữ liệu (3 điểm)

- [x] 1.1 (2đ): 35 bảng với PK, FK, CHECK constraints
- [x] 1.2 (1đ): Dữ liệu ≥ 5 dòng/bảng, có ý nghĩa

### ✅ Phần 2: Triggers, Procedures, Functions (4 điểm)

- [x] 2.1 (1đ): SP thêm/sửa/xóa với validation (`d_enhanced_procedures_fixed.sql`)
- [x] 2.2 (1đ): Triggers kiểm tra ràng buộc & tính thuộc tính dẫn xuất (`b_trigger_func_proc.sql`)
- [x] 2.3 (1đ): 2 SP truy vấn với WHERE/HAVING/GROUP BY (`d_enhanced_procedures_fixed.sql`)
- [x] 2.4 (1đ): 2 Functions với IF/LOOP/Cursor (`b_trigger_func_proc.sql`)

### ✅ Phần 3: Ứng dụng (3 điểm)

- [x] 3.1 (1đ): Giao diện CRUD cho LOCATION (React app đang chạy)
- [x] 3.2 (1đ): Danh sách + search/filter/sort
- [x] 3.3 (1đ): Giao diện gọi SP/Function khác

---

## 📞 HỖ TRỢ

Nếu gặp lỗi, vui lòng kiểm tra:
1. ✅ MySQL version ≥ 8.0
2. ✅ Charset: utf8mb4
3. ✅ Chạy đúng thứ tự files
4. ✅ File `g_insert_data.sql` đã được update (priceLev tiếng Anh)
5. ✅ File `a_create_table.sql` đã được update (constraint tiếng Anh)

---

**Lưu ý cuối cùng:** 
- ⚠️ **KHÔNG sử dụng** file `c_enhanced_procedures.sql` (đã deprecated)
- ✅ **SỬ DỤNG** file `d_enhanced_procedures_fixed.sql` thay thế
- 🔄 Nếu muốn reset toàn bộ: `DROP DATABASE VIVUVIET;` rồi chạy lại từ đầu

---

**Tạo bởi:** Nhóm 5 - BTL2 Hệ CSDL  
**Ngày cập nhật:** 25/11/2025  
**Version:** 2.0 - Final (Fixed priceLev mismatch)
