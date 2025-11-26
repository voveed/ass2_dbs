/*
================================================================
 FILE: a_create_table_DOCUMENTED.sql
 MỤC ĐÍCH: Tạo cấu trúc database CÓ CHÚ THÍCH CHI TIẾT
 - Mỗi bảng có comment giải thích:
   + PRIMARY KEY và ý nghĩa
   + FOREIGN KEY relationships
   + CHECK constraints và validation rules
   + UNIQUE constraints
   + ENUM values
   + Computed/Generated columns
   + Triggers liên quan (nếu có)
================================================================
*/

CREATE DATABASE IF NOT EXISTS VIVUVIET CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE VIVUVIET;

-- ================================================================
-- USER_ACCOUNT: Bảng tài khoản người dùng
-- ================================================================
-- PRIMARY KEY: userID (AUTO_INCREMENT)
-- UNIQUE: mail - Mỗi email chỉ đăng ký 1 tài khoản
-- CHECK CONSTRAINTS:
--   - CHK_UserRole: role phải là 'ADMIN', 'TOURIST', hoặc 'OWNER'
--   - CHK_EmailFormat: Kiểm tra định dạng email hợp lệ (regex)
-- TRIGGERS LIÊN QUAN:
--   - trg_before_user_insert_check_age: Kiểm tra tuổi >= 18 khi INSERT (b_trigger_func_proc.sql)
--   - trg_before_user_update_check_age: Kiểm tra tuổi >= 18 khi UPDATE (b_trigger_func_proc.sql)
-- RÀNG BUỘC NGỮ NGHĨA #7: Đảm bảo người dùng >= 18 tuổi
-- MỤC ĐÍCH: Lưu thông tin cơ bản của mọi người dùng trong hệ thống
-- ================================================================
CREATE TABLE USER_ACCOUNT (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    mail VARCHAR(255) NOT NULL UNIQUE,
    fullName VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    district VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    DOB DATE,
    role VARCHAR(50) NOT NULL,
    gender VARCHAR(10),
    CONSTRAINT CHK_UserRole CHECK (role IN ('ADMIN', 'TOURIST', 'OWNER')),
    CONSTRAINT CHK_EmailFormat CHECK (mail REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- USER_PHONE: Bảng số điện thoại người dùng
-- ================================================================
-- PRIMARY KEY: (userID, phoneNumber) - Composite Key
-- FOREIGN KEY: 
--   - userID -> USER_ACCOUNT(userID) ON DELETE CASCADE
--     (Khi user bị xóa, phone numbers tương ứng cũng bị xóa)
-- CHECK CONSTRAINTS:
--   - CHK_PhoneFormat: SĐT phải có 10-15 chữ số
-- MỤC ĐÍCH: Quan hệ 1-N, cho phép user có nhiều số điện thoại
-- ================================================================
CREATE TABLE USER_PHONE ( 
    userID INT NOT NULL,
    phoneNumber VARCHAR(15) NOT NULL,
    PRIMARY KEY (userID, phoneNumber),
    CONSTRAINT FK_UserPhone_User FOREIGN KEY (userID) REFERENCES USER_ACCOUNT(userID) ON DELETE CASCADE,
    CONSTRAINT CHK_PhoneFormat CHECK (phoneNumber REGEXP '^[0-9]{10,15}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- IMAGE: Bảng hình ảnh
-- ================================================================
-- PRIMARY KEY: imageID (AUTO_INCREMENT)
-- UNIQUE: URL - Mỗi URL chỉ lưu 1 lần
-- ENUM (không enforce): imageType có thể là:
--   - 'AVATAR': Ảnh đại diện user
--   - 'LOCATION_HERO': Ảnh chính của location
--   - 'LOCATION_GALLERY': Ảnh phụ trong gallery
--   - 'UTILITY': Ảnh tiện ích
-- MỤC ĐÍCH: Lưu trữ tập trung tất cả hình ảnh trong hệ thống
-- ================================================================
CREATE TABLE IMAGE (
    imageID INT AUTO_INCREMENT PRIMARY KEY,
    URL VARCHAR(255) NOT NULL UNIQUE,  
    caption VARCHAR(500),
    imageType VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- PREFERENCE: Bảng sở thích/tags
-- ================================================================
-- PRIMARY KEY: prefID (AUTO_INCREMENT)
-- UNIQUE: prefName - Tên sở thích không trùng lặp
-- MỤC ĐÍCH: Danh mục tags để gán cho locations (VD: Beach, Mountain, Luxury...)
-- ================================================================
CREATE TABLE PREFERENCE (
    prefID INT AUTO_INCREMENT PRIMARY KEY,
    prefName VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100),
    prefDescription TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- UTILITY: Bảng tiện ích
-- ================================================================
-- PRIMARY KEY: utility (AUTO_INCREMENT)
-- UNIQUE: uName - Tên tiện ích không trùng
-- MỤC ĐÍCH: Danh mục các tiện ích (WiFi, Pool, Parking...) để gán cho locations
-- ================================================================
CREATE TABLE UTILITY (
    utility INT AUTO_INCREMENT PRIMARY KEY,
    uName VARCHAR(255) UNIQUE,
    uType VARCHAR(100),
    UDescription TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- PRODUCT: Bảng sản phẩm/dịch vụ
-- ================================================================
-- PRIMARY KEY: productID (AUTO_INCREMENT)
-- CHECK CONSTRAINTS:
--   - CHK_ProductCat: category ∈ {'ROOMTYPE', 'TABLE_TYPE', 'TICKET_TYPE'}
--   - CHK_ProductBasePrice: basePrice >= 0 (không âm)
-- MỤC ĐÍCH: Lưu thông tin các sản phẩm/dịch vụ như loại phòng, loại bàn, loại vé
-- ================================================================
CREATE TABLE PRODUCT (
    productID INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    pricingUnit VARCHAR(50) NOT NULL,
    description TEXT,
    basePrice DECIMAL(18, 2) NOT NULL,
    productName VARCHAR(255) NOT NULL,
    CONSTRAINT CHK_ProductCat CHECK (category IN ('ROOMTYPE', 'TABLE_TYPE', 'TICKET_TYPE')),
    CONSTRAINT CHK_ProductBasePrice CHECK (basePrice >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- ROOMTYPE: Loại phòng (Subclass của PRODUCT)
-- ================================================================
-- PRIMARY KEY: roomTypeID (cũng là FK to PRODUCT)
-- FOREIGN KEY:
--   - roomTypeID -> PRODUCT(productID) ON DELETE CASCADE
-- CHECK CONSTRAINTS:
--   - CHK_RoomCapacity: capacity > 0
-- MỤC ĐÍCH: Lưu thông tin chi tiết cho sản phẩm là phòng khách sạn
-- ================================================================
CREATE TABLE ROOMTYPE (
    roomTypeID INT PRIMARY KEY,
    capacity INT NOT NULL,
    CONSTRAINT FK_RoomType_Product FOREIGN KEY (roomTypeID) REFERENCES PRODUCT(productID) ON DELETE CASCADE,
    CONSTRAINT CHK_RoomCapacity CHECK (capacity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLE_TYPE: Loại bàn (Subclass của PRODUCT)
-- ================================================================
-- PRIMARY KEY: tableTypeID (cũng là FK to PRODUCT)
-- FOREIGN KEY:
--   - tableTypeID -> PRODUCT(productID) ON DELETE CASCADE
-- CHECK CONSTRAINTS:
--   - CHK_TableCapacity: numOfCustomers > 0
-- MỤC ĐÍCH: Lưu thông tin chi tiết cho sản phẩm là bàn nhà hàng
-- ================================================================
CREATE TABLE TABLE_TYPE (
    tableTypeID INT PRIMARY KEY,
    numOfCustomers INT NOT NULL,
    viewDescription VARCHAR(255),
    CONSTRAINT FK_TableType_Product FOREIGN KEY (tableTypeID) REFERENCES PRODUCT(productID) ON DELETE CASCADE,
    CONSTRAINT CHK_TableCapacity CHECK (numOfCustomers > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TICKET_TYPE: Loại vé (Subclass của PRODUCT)
-- ================================================================
-- PRIMARY KEY: ticketTypeID (cũng là FK to PRODUCT)
-- FOREIGN KEY:
--   - ticketTypeID -> PRODUCT(productID) ON DELETE CASCADE
-- MỤC ĐÍCH: Lưu thông tin chi tiết cho sản phẩm là vé tham quan/giải trí
-- ================================================================
CREATE TABLE TICKET_TYPE (
    ticketTypeID INT PRIMARY KEY,
    validity VARCHAR(100),
    audienceType VARCHAR(100),
    CONSTRAINT FK_TicketType_Product FOREIGN KEY (ticketTypeID) REFERENCES PRODUCT(productID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- VOUCHER: Bảng mã giảm giá
-- ================================================================
-- PRIMARY KEY: voucherID (AUTO_INCREMENT)
-- CHECK CONSTRAINTS:
--   - CHK_VoucherDates: expDate >= startDate (hạn dùng sau ngày bắt đầu)
--   - CHK_VoucherDiscount: 0 < discountPercentage <= 1 (giảm 1-100%)
--   - CHK_VoucherSlots: slots > 0 (phải có ít nhất 1 slot)
--   - CHK_LimitVal: limitVal >= 0 (giá trị giảm tối đa không âm)
--   - CHK_VoucherRank: 0 <= rankRequirement <= 4 (Bronze=0, Diamond=4)
-- COMPUTED COLUMN:
--   - remaining_slots: slots - used_slots (STORED)
--     Tự động tính số slot còn lại
-- TRIGGERS LIÊN QUAN:
--   - trg_check_voucher_validity: Kiểm tra voucher hợp lệ khi đặt hàng (b_trigger_func_proc.sql)
--   - trg_use_voucher_slot: Giảm remaining_slots khi sử dụng voucher (b_trigger_func_proc.sql)
-- VIEW LIÊN QUAN:
--   - vw_voucher_status: Tính status động (UPCOMING/ACTIVE/SOLDOUT/EXPIRED)
-- MỤC ĐÍCH: Quản lý mã giảm giá với điều kiện hạng, thời gian, số lượng
-- ================================================================
CREATE TABLE VOUCHER (
    voucherID INT AUTO_INCREMENT PRIMARY KEY,
    rankRequirement INT DEFAULT 0,
    limitVal DECIMAL(18, 2) DEFAULT 0,
    discountPercentage FLOAT NOT NULL,
    slots INT NOT NULL,
    used_slots INT DEFAULT 0,
    voucherDescription VARCHAR(500) NOT NULL,
    startDate DATE NOT NULL,
    expDate DATE NOT NULL,
    remaining_slots INT AS (slots - used_slots) STORED,
    -- Note: status removed as computed column (CURDATE() not allowed in MySQL generated columns)
    -- Use VIEW or query: CASE WHEN CURDATE() < startDate THEN 'UPCOMING' WHEN CURDATE() > expDate THEN 'EXPIRED' WHEN remaining_slots <= 0 THEN 'SOLDOUT' ELSE 'ACTIVE' END
    CONSTRAINT CHK_VoucherDates CHECK (expDate >= startDate),
    CONSTRAINT CHK_VoucherDiscount CHECK (discountPercentage > 0 AND discountPercentage <= 1),
    CONSTRAINT CHK_VoucherSlots CHECK (slots > 0),
    CONSTRAINT CHK_LimitVal CHECK (limitVal >= 0),
    CONSTRAINT CHK_VoucherRank CHECK (rankRequirement >= 0 AND rankRequirement <= 4)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- ADMINISTRATOR: Bảng quản trị viên
-- ================================================================
-- PRIMARY KEY: adminID
-- FOREIGN KEY:
--   - adminID -> USER_ACCOUNT(userID) ON DELETE CASCADE
--     (adminID phải tồn tại trong USER_ACCOUNT với role='ADMIN')
-- MỤC ĐÍCH: Lưu thông tin bổ sung của admin (chức danh, quyền hạn)
-- ================================================================
CREATE TABLE ADMINISTRATOR (
    adminID INT PRIMARY KEY,
    jobName VARCHAR(100) NOT NULL,
    permissionLevel VARCHAR(100) NOT NULL,
    CONSTRAINT FK_Admin_User FOREIGN KEY (adminID) REFERENCES USER_ACCOUNT(userID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- BUSINESS_OWNER: Bảng chủ doanh nghiệp
-- ================================================================
-- PRIMARY KEY: BOID (Business Owner ID)
-- UNIQUE: taxCode - Mã số thuế duy nhất
-- FOREIGN KEY:
--   - BOID -> USER_ACCOUNT(userID) ON DELETE CASCADE
--     (BOID phải tồn tại trong USER_ACCOUNT với role='OWNER')
-- CHECK CONSTRAINTS:
--   - CHK_OwnerAuthStatus: auStatus ∈ {'PENDING', 'VERIFIED', 'REJECTED'}
-- DEFAULT: auStatus = 'PENDING' (chờ xác minh khi đăng ký)
-- MỤC ĐÍCH: Lưu thông tin doanh nghiệp và trạng thái xác minh
-- ================================================================
CREATE TABLE BUSINESS_OWNER (
    BOID INT PRIMARY KEY,
    taxCode VARCHAR(100) NOT NULL UNIQUE,
    auStatus VARCHAR(50) DEFAULT 'PENDING',
    CONSTRAINT FK_BusinessOwner_User FOREIGN KEY (BOID) REFERENCES USER_ACCOUNT(userID) ON DELETE CASCADE,
    CONSTRAINT CHK_OwnerAuthStatus CHECK (auStatus IN ('PENDING', 'VERIFIED', 'REJECTED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TOURIST: Bảng khách du lịch
-- ================================================================
-- PRIMARY KEY: touristID
-- FOREIGN KEY:
--   - touristID -> USER_ACCOUNT(userID) ON DELETE CASCADE
--     (touristID phải tồn tại trong USER_ACCOUNT với role='TOURIST')
-- CHECK CONSTRAINTS:
--   - CHK_TouristLoyalty: loyaltypoints >= 0 (điểm tích lũy không âm)
--   - CHK_TouristSpent: totalSpent >= 0 (tổng chi tiêu không âm)
--   - CHK_TouristRank: 0 <= rankLevel <= 4
-- RANK LEVELS:
--   - 0 = Bronze   (< 5 triệu)
--   - 1 = Silver   (5-10 triệu)
--   - 2 = Gold     (10-15 triệu)
--   - 3 = Platinum (15-20 triệu)
--   - 4 = Diamond  (>= 20 triệu)
-- TRIGGERS LIÊN QUAN:
--   - trg_after_tourist_spent_update_rank: Tự động cập nhật rankLevel khi totalSpent thay đổi (b_trigger_func_proc.sql)
--     Logic: Dựa trên totalSpent để set rankLevel (0-4)
-- FUNCTIONS LIÊN QUAN:
--   - fn_get_tourist_rank(touristID): Tính rank dựa trên totalSpent
-- MỤC ĐÍCH: Lưu thông tin khách hàng, điểm tích lũy, hạng thành viên
-- ================================================================
CREATE TABLE TOURIST (
    touristID INT PRIMARY KEY,
    nationality VARCHAR(100) NOT NULL,
    legalID VARCHAR(100) NOT NULL,
    loyaltypoints INT DEFAULT 0,
    totalSpent DECIMAL(18, 2) DEFAULT 0,
    rankLevel INT DEFAULT 0, -- 0=Bronze, 1=Silver, 2=Gold, 3=Platinum, 4=Diamond
    memberSince DATE,
    CONSTRAINT FK_Tourist_User FOREIGN KEY (touristID) REFERENCES USER_ACCOUNT(userID) ON DELETE CASCADE,
    CONSTRAINT CHK_TouristLoyalty CHECK (loyaltypoints >= 0),
    CONSTRAINT CHK_TouristSpent CHECK (totalSpent >= 0),
    CONSTRAINT CHK_TouristRank CHECK (rankLevel >= 0 AND rankLevel <= 4)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- LOCATION: Bảng địa điểm
-- ================================================================
-- PRIMARY KEY: locID (AUTO_INCREMENT)
-- FOREIGN KEY:
--   - ownerID -> BUSINESS_OWNER(BOID) ON DELETE CASCADE
--     (Khi owner bị xóa, locations của họ cũng bị xóa)
-- CHECK CONSTRAINTS:
--   - CHK_LocType: locType ∈ {'HOTEL', 'RESTAURANT', 'TOUR', 'OTHER'}
--   - CHK_LocStatus: status ∈ {'PENDING', 'ACTIVE', 'INACTIVE'}
--   - CHK_PriceLev: priceLev ∈ {'BUDGET', 'MID_RANGE', 'UPSCALE', 'LUXURY'}
--   - CHK_LocRating: 0 <= avgRating <= 5
-- DEFAULT: status = 'PENDING' (chờ duyệt khi tạo mới)
-- SOFT DELETE: Dùng status='INACTIVE' thay vì DELETE
-- TRIGGERS LIÊN QUAN:
--   - trg_after_review_insert: Tự động cập nhật ratingPoints khi có review mới (b_trigger_func_proc.sql)
--   - trg_after_review_update: Tự động cập nhật ratingPoints khi review thay đổi (b_trigger_func_proc.sql)
--   - trg_after_review_delete: Tự động cập nhật ratingPoints khi xóa review (b_trigger_func_proc.sql)
--   - trg_after_location_rating_check_quality: Auto set INACTIVE khi ratingPoints < 2.0 (i_missing_constraints_triggers.sql)
-- RÀNG BUỘC NGỮ NGHĨA #8: Location rating quá thấp tự động chuyển INACTIVE
-- MỤC ĐÍCH: Lưu thông tin địa điểm du lịch (hotels, restaurants, tours...)
-- ================================================================
CREATE TABLE LOCATION (
    locID INT AUTO_INCREMENT PRIMARY KEY,
    ownerID INT NOT NULL,
    locName VARCHAR(255) NOT NULL,
    locNo VARCHAR(50),
    street VARCHAR(255),
    ward VARCHAR(255),
    district VARCHAR(100),
    province VARCHAR(100) NOT NULL,
    locType VARCHAR(50) NOT NULL,
    description TEXT,
    priceLev VARCHAR(50) NOT NULL,
    avgRating DECIMAL(2, 1) DEFAULT 0,
    totalReviews INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'PENDING',
    CONSTRAINT FK_Location_Owner FOREIGN KEY (ownerID) REFERENCES BUSINESS_OWNER(BOID) ON DELETE CASCADE,
    CONSTRAINT CHK_LocType CHECK (locType IN ('HOTEL', 'RESTAURANT', 'TOUR', 'OTHER')),
    CONSTRAINT CHK_LocStatus CHECK (status IN ('PENDING', 'ACTIVE', 'INACTIVE')),
    CONSTRAINT CHK_PriceLev CHECK (priceLev IN ('BUDGET', 'MID_RANGE', 'UPSCALE', 'LUXURY')),
    CONSTRAINT CHK_LocRating CHECK (avgRating >= 0 AND avgRating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- Các bảng quan hệ M-N (Junction Tables)
-- ================================================================

-- ================================================================
-- LOC_HAS_IMAGE: Quan hệ Location - Image (M-N)
-- ================================================================
-- PRIMARY KEY: (locID, imageID) - Composite
-- FOREIGN KEYS:
--   - locID -> LOCATION(locID) ON DELETE CASCADE
--   - imageID -> IMAGE(imageID) ON DELETE CASCADE
-- MỤC ĐÍCH: Một location có nhiều images, một image có thể thuộc nhiều locations
-- ================================================================
CREATE TABLE LOC_HAS_IMAGE (
    locID INT NOT NULL,
    imageID INT NOT NULL,
    PRIMARY KEY (locID, imageID),
    CONSTRAINT FK_LocImage_Location FOREIGN KEY (locID) REFERENCES LOCATION(locID) ON DELETE CASCADE,
    CONSTRAINT FK_LocImage_Image FOREIGN KEY (imageID) REFERENCES IMAGE(imageID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- LOC_HAS_PREFERENCE: Quan hệ Location - Preference (M-N)
-- ================================================================
-- PRIMARY KEY: (preference, locID) - Composite
-- FOREIGN KEYS:
--   - preference -> PREFERENCE(prefID) ON DELETE CASCADE
--   - locID -> LOCATION(locID) ON DELETE CASCADE
-- STORED PROCEDURES LIÊN QUAN:
--   - sp_get_location_preferences(locID)
--   - sp_add_location_preference(locID, prefID)
--   - sp_remove_location_preference(locID, prefID)
-- MỤC ĐÍCH: Gán tags/sở thích cho locations (Beach, Luxury, Family-Friendly...)
-- ================================================================
CREATE TABLE LOC_HAS_PREFERENCE (
    preference INT NOT NULL,
    locID INT NOT NULL,
    PRIMARY KEY (preference, locID),
    CONSTRAINT FK_LocPref_Pref FOREIGN KEY (preference) REFERENCES PREFERENCE(prefID) ON DELETE CASCADE,
    CONSTRAINT FK_LocPref_Location FOREIGN KEY (locID) REFERENCES LOCATION(locID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- RESERVATION: Bảng đơn đặt chỗ
-- ================================================================
-- PRIMARY KEY: reservationID (AUTO_INCREMENT)
-- FOREIGN KEYS:
--   - touristID -> TOURIST(touristID)
--   - voucherID -> VOUCHER(voucherID) ON DELETE SET NULL
-- CHECK CONSTRAINTS:
--   - CHK_ReservationStatus: status ∈ {'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'}
-- COMPUTED COLUMN:
--   - paymentStatus: CASE WHEN totalPaid <= 0 THEN 'Unpaid'
--                         WHEN totalPaid >= (totalAmount - totalDiscount) THEN 'Paid'
--                         ELSE 'Partial' END (STORED)
-- TRIGGERS LIÊN QUAN:
--   - trg_before_reservation_status_update: Kiểm tra vòng đời status hợp lệ (i_missing_constraints_triggers.sql)
--   - trg_check_voucher_validity: Validate voucher còn slot và hợp lệ (b_trigger_func_proc.sql)
--   - trg_use_voucher_slot: Giảm voucher slot khi dùng (b_trigger_func_proc.sql)
-- RÀNG BUỘC NGỮ NGHĨA #4: Vòng đời status (PENDING → CONFIRMED → COMPLETED)
-- MỤC ĐÍCH: Lưu đơn đặt chỗ, quản lý trạng thái, thanh toán
-- ================================================================
CREATE TABLE RESERVATION (
    reservationID INT AUTO_INCREMENT PRIMARY KEY,
    resTimeStamp DATETIME NOT NULL DEFAULT NOW(),
    status VARCHAR(50) NOT NULL,
    note VARCHAR(500),
    touristID INT NOT NULL,
    voucherID INT NULL,
    numOfItems INT DEFAULT 0,
    totalAmount DECIMAL(18, 2) DEFAULT 0,
    totalDiscount DECIMAL(18, 2) DEFAULT 0,
    totalPaid DECIMAL(18, 2) DEFAULT 0,
    paymentStatus VARCHAR(10) AS (CASE
        WHEN totalPaid <= 0 THEN 'Unpaid'
        WHEN totalPaid >= (totalAmount - totalDiscount) THEN 'Paid'
        ELSE 'Partial'
    END) STORED,
    CONSTRAINT FK_Reservation_Tourist FOREIGN KEY (touristID) REFERENCES TOURIST(touristID),
    CONSTRAINT FK_Reservation_Voucher FOREIGN KEY (voucherID) REFERENCES VOUCHER(voucherID) ON DELETE SET NULL,
    CONSTRAINT CHK_ReservationStatus CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- FEEDBACK: Bảng phản hồi (cha của REVIEW và COMMENT)
-- ================================================================
-- PRIMARY KEY: fbID (AUTO_INCREMENT)
-- FOREIGN KEYS:
--   - userID -> USER_ACCOUNT(userID)
--   - locID -> LOCATION(locID)
-- CHECK CONSTRAINTS:
--   - CHK_FeedbackType: feedbackType ∈ {'REVIEW', 'COMMENT'}
--   - CHK_LikeCount: likeCount >= 0
-- TRIGGERS LIÊN QUAN:
--   - trg_before_review_insert_check_completed: Kiểm tra quyền viết review (b_trigger_func_proc.sql)
--     + Chỉ TOURIST mới được viết review
--     + Phải có >= 1 reservation COMPLETED
--     + Một tourist chỉ 1 review cho 1 location
--   - trg_after_like_update_count: Auto update likeCount (b_trigger_func_proc.sql)
-- RÀNG BUỘC NGỮ NGHĨA #1, #2, #5: Duy nhất + Quyền + Vai trò review
-- MỤC ĐÍCH: Lưu feedback, kế thừa thành REVIEW và COMMENT
-- ================================================================
CREATE TABLE FEEDBACK (
    fbID INT AUTO_INCREMENT PRIMARY KEY,
    fbDateTime DATETIME NOT NULL DEFAULT NOW(),
    likeCount INT DEFAULT 0,
    userID INT NOT NULL,
    locID INT NOT NULL,
    feedbackType VARCHAR(50) NOT NULL,
    CONSTRAINT FK_Feedback_User FOREIGN KEY (userID) REFERENCES USER_ACCOUNT(userID),
    CONSTRAINT FK_Feedback_Location FOREIGN KEY (locID) REFERENCES LOCATION(locID),
    CONSTRAINT CHK_LikeCount CHECK (likeCount >= 0),
    CONSTRAINT CHK_FeedbackType CHECK (feedbackType IN ('REVIEW', 'COMMENT'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- USER_ACCOUNT_HAS_IMAGE: Ảnh đại diện user (1-1)
-- ================================================================
-- PRIMARY KEY: userID
-- UNIQUE: imageID - Mỗi image chỉ dùng cho 1 user
-- FOREIGN KEYS:
--   - userID -> USER_ACCOUNT(userID) ON DELETE CASCADE
--   - imageID -> IMAGE(imageID)
-- MỤC ĐÍCH: Liên kết user với ảnh đại diện
-- ================================================================
CREATE TABLE USER_ACCOUNT_HAS_IMAGE (
    userID INT PRIMARY KEY,
    imageID INT NOT NULL UNIQUE,
    CONSTRAINT FK_UserImage_User FOREIGN KEY (userID) REFERENCES USER_ACCOUNT(userID) ON DELETE CASCADE,
    CONSTRAINT FK_UserImage_Image FOREIGN KEY (imageID) REFERENCES IMAGE(imageID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TOURIST_HAS_PREFERENCE: Sở thích của tourist (M-N)
-- ================================================================
-- PRIMARY KEY: (prefID, touristID) - Composite
-- FOREIGN KEYS:
--   - prefID -> PREFERENCE(prefID)
--   - touristID -> TOURIST(touristID)
-- MỤC ĐÍCH: Lưu sở thích của tourist để gợi ý locations phù hợp
-- ================================================================
CREATE TABLE TOURIST_HAS_PREFERENCE (
    prefID INT NOT NULL,
    touristID INT NOT NULL,
    PRIMARY KEY (prefID, touristID),
    CONSTRAINT FK_TPref_Preference FOREIGN KEY (prefID) REFERENCES PREFERENCE(prefID),
    CONSTRAINT FK_TPref_Tourist FOREIGN KEY (touristID) REFERENCES TOURIST(touristID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- HOTEL: Bảng khách sạn (kế thừa LOCATION)
-- ================================================================
-- PRIMARY KEY: hotelID (cũng là FK to LOCATION)
-- FOREIGN KEY:
--   - hotelID -> LOCATION(locID) ON DELETE CASCADE
-- CHECK CONSTRAINTS:
--   - CHK_HotelStars: 0 <= officialStarRating <= 5
-- MỤC ĐÍCH: Lưu thông tin bổ sung cho locations là khách sạn
-- ================================================================
CREATE TABLE HOTEL (
    hotelID INT PRIMARY KEY,
    officialStarRating FLOAT DEFAULT 0,
    standardCheckinTime TIME NOT NULL,
    standardCheckOutTime TIME NOT NULL,
    CONSTRAINT FK_Hotel_Location FOREIGN KEY (hotelID) REFERENCES LOCATION(locID) ON DELETE CASCADE,
    CONSTRAINT CHK_HotelStars CHECK (officialStarRating >= 0 AND officialStarRating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- RESTAURANT: Bảng nhà hàng (kế thừa LOCATION)
-- ================================================================
-- PRIMARY KEY: restaurantID (cũng là FK to LOCATION)
-- FOREIGN KEY:
--   - restaurantID -> LOCATION(locID) ON DELETE CASCADE
-- MỤC ĐÍCH: Lưu thông tin bổ sung cho locations là nhà hàng
-- ================================================================
CREATE TABLE RESTAURANT (
    restaurantID INT PRIMARY KEY,
    cuisineType VARCHAR(100) NOT NULL,
    menuURL VARCHAR(2048),
    CONSTRAINT FK_Restaurant_Location FOREIGN KEY (restaurantID) REFERENCES LOCATION(locID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- ENTERTAINMENT_VENUE: Bảng địa điểm giải trí (kế thừa LOCATION)
-- ================================================================
-- PRIMARY KEY: EVID (Entertainment Venue ID, cũng là FK to LOCATION)
-- FOREIGN KEY:
--   - EVID -> LOCATION(locID) ON DELETE CASCADE
-- MỤC ĐÍCH: Lưu thông tin bổ sung cho locations là địa điểm giải trí
-- ================================================================
CREATE TABLE ENTERTAINMENT_VENUE (
    EVID INT PRIMARY KEY,
    attractionType VARCHAR(100) NOT NULL,
    targetAudience VARCHAR(100),
    CONSTRAINT FK_Venue_Location FOREIGN KEY (EVID) REFERENCES LOCATION(locID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- LOC_HAS_UTILITY: Tiện ích của location (M-N)
-- ================================================================
-- PRIMARY KEY: (utility, locID) - Composite
-- FOREIGN KEYS:
--   - utility -> UTILITY(utility) ON DELETE CASCADE
--   - locID -> LOCATION(locID) ON DELETE CASCADE
-- STORED PROCEDURES LIÊN QUAN:
--   - sp_get_location_utilities(locID)
--   - sp_add_location_utility(locID, utilityID)
-- MỤC ĐÍCH: Gán tiện ích cho locations (WiFi, Pool, Parking...)
-- ================================================================
CREATE TABLE LOC_HAS_UTILITY (
    utility INT NOT NULL,
    locID INT NOT NULL,
    PRIMARY KEY (utility, locID),
    CONSTRAINT FK_LU_Utility FOREIGN KEY (utility) REFERENCES UTILITY(utility) ON DELETE CASCADE,
    CONSTRAINT FK_LU_Location FOREIGN KEY (locID) REFERENCES LOCATION(locID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- LOCATION_HAS_PREFERENCE: Location preferences (M-N)
-- ================================================================
-- Note: Giống LOC_HAS_PREFERENCE, có thể là duplicate schema
-- PRIMARY KEY: (prefID, locID) - Composite
-- FOREIGN KEYS:
--   - prefID -> PREFERENCE(prefID) ON DELETE CASCADE
--   - locID -> LOCATION(locID) ON DELETE CASCADE
-- MỤC ĐÍCH: Gán preferences/tags cho locations
-- ================================================================
CREATE TABLE LOCATION_HAS_PREFERENCE (
    prefID INT NOT NULL,
    locID INT NOT NULL,
    PRIMARY KEY (prefID, locID),
    CONSTRAINT FK_LPref_Preference FOREIGN KEY (prefID) REFERENCES PREFERENCE(prefID) ON DELETE CASCADE,
    CONSTRAINT FK_LPref_Location FOREIGN KEY (locID) REFERENCES LOCATION(locID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- LOCATION_HAS_PRODUCT: Products của location (M-N)
-- ================================================================
-- PRIMARY KEY: (productID, locID) - Composite
-- FOREIGN KEYS:
--   - productID -> PRODUCT(productID) ON DELETE CASCADE
--   - locID -> LOCATION(locID) ON DELETE CASCADE
-- STORED PROCEDURES LIÊN QUAN:
--   - sp_get_location_products(locID)
--   - sp_create_and_add_product(locID, ...)
-- MỤC ĐÍCH: Gán products (phòng, bàn, vé) cho locations
-- ================================================================
CREATE TABLE LOCATION_HAS_PRODUCT (
    productID INT NOT NULL,
    locID INT NOT NULL,
    PRIMARY KEY (productID, locID),
    CONSTRAINT FK_LP_Product FOREIGN KEY (productID) REFERENCES PRODUCT(productID) ON DELETE CASCADE,
    CONSTRAINT FK_LP_Location FOREIGN KEY (locID) REFERENCES LOCATION(locID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- LOCATION_OPENING_HOURS: Giờ mở cửa location
-- ================================================================
-- PRIMARY KEY: (locID, dayOfWeek, openTime, closeTime) - Composite
-- FOREIGN KEY:
--   - locID -> LOCATION(locID) ON DELETE CASCADE
-- CHECK CONSTRAINTS:
--   - CHK_DayOfWeek: 0 <= dayOfWeek <= 6 (0=Sunday, 6=Saturday)
--   - CHK_OpeningTimes: closeTime > openTime
-- STORED PROCEDURES LIÊN QUAN:
--   - sp_get_location_opening_hours(locID)
--   - sp_add_location_opening_hour(locID, dayOfWeek, openTime, closeTime)
--   - sp_delete_location_opening_hour(...)
-- MỤC ĐÍCH: Lưu giờ mở cửa theo ngày trong tuần
-- ================================================================
CREATE TABLE LOCATION_OPENING_HOURS (
    locID INT NOT NULL,
    dayOfWeek INT NOT NULL,
    openTime TIME NOT NULL,
    closeTime TIME NOT NULL,
    PRIMARY KEY (locID, dayOfWeek, openTime, closeTime),
    CONSTRAINT FK_OH_Location FOREIGN KEY (locID) REFERENCES LOCATION(locID) ON DELETE CASCADE,
    CONSTRAINT CHK_DayOfWeek CHECK (dayOfWeek BETWEEN 0 AND 6),
    CONSTRAINT CHK_OpeningTimes CHECK (closeTime > openTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- BOOKING_DETAILS: Chi tiết đặt chỗ
-- ================================================================
-- PRIMARY KEY: (reservationID, itemID) - Composite
-- FOREIGN KEYS:
--   - reservationID -> RESERVATION(reservationID) ON DELETE CASCADE
--   - productID -> PRODUCT(productID)
-- CHECK CONSTRAINTS:
--   - CHK_BookingDates: checkoutDateTime > checkingDateTime
-- TRIGGERS LIÊN QUAN:
--   - trg_after_booking_details_insert: Auto update totalAmount (b_trigger_func_proc.sql)
--   - trg_after_booking_details_update: Auto update totalAmount (b_trigger_func_proc.sql)
--   - trg_after_booking_details_delete: Auto update totalAmount (b_trigger_func_proc.sql)
-- FUNCTIONS LIÊN QUAN:
--   - fn_calculate_reservation_total: Tính tổng tiền
-- RÀNG BUỘC NGỮ NGHĨA #3: checkoutDateTime > checkingDateTime
-- MỤC ĐÍCH: Lưu chi tiết từng item trong reservation, auto tính tổng
-- ================================================================
CREATE TABLE BOOKING_DETAILS (
    reservationID INT NOT NULL,
    itemID INT NOT NULL,
    quantity INT NOT NULL,
    unitPrice DECIMAL(18, 2) NOT NULL,
    checkingDateTime DATETIME NOT NULL,
    checkoutDateTime DATETIME NOT NULL,
    productID INT NOT NULL,
    PRIMARY KEY (reservationID, itemID),
    CONSTRAINT FK_BD_Reservation FOREIGN KEY (reservationID) REFERENCES RESERVATION(reservationID) ON DELETE CASCADE,
    CONSTRAINT FK_BD_Product FOREIGN KEY (productID) REFERENCES PRODUCT(productID),
    CONSTRAINT CHK_BookingDates CHECK (checkoutDateTime > checkingDateTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TRANSACTION: Giao dịch thanh toán
-- ================================================================
-- PRIMARY KEY: transactionID (AUTO_INCREMENT)
-- UNIQUE: gatewayTransactionID - Mã GD từ payment gateway
-- FOREIGN KEY:
--   - reservationID -> RESERVATION(reservationID)
-- CHECK CONSTRAINTS:
--   - CHK_PaidAmount: paidAmount >= 0
-- TRIGGERS LIÊN QUAN:
--   - trg_after_transaction_completed: Auto update totalPaid, totalSpent (b_trigger_func_proc.sql)
-- MỤC ĐÍCH: Lưu lịch sử thanh toán, auto update số tiền đã trả
-- ================================================================
CREATE TABLE `TRANSACTION` (
    transactionID INT AUTO_INCREMENT PRIMARY KEY,
    paidAmount DECIMAL(18, 2) NOT NULL,
    paymentMethod VARCHAR(50),
    transactionDateTime DATETIME NOT NULL DEFAULT NOW(),
    status VARCHAR(50) NOT NULL,
    gatewayTransactionID VARCHAR(255) UNIQUE,
    reservationID INT NOT NULL,
    CONSTRAINT FK_Transaction_Reservation FOREIGN KEY (reservationID) REFERENCES RESERVATION(reservationID),
    CONSTRAINT CHK_PaidAmount CHECK (paidAmount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- REVIEW: Đánh giá (kế thừa FEEDBACK)
-- ================================================================
-- PRIMARY KEY: reviewID (cũng là FK to FEEDBACK)
-- FOREIGN KEY:
--   - reviewID -> FEEDBACK(fbID) ON DELETE CASCADE
-- CHECK CONSTRAINTS:
--   - CHK_RatingRange: ratingPoints BETWEEN 1 AND 5
-- TRIGGERS LIÊN QUAN:
--   - trg_before_review_insert_check_completed: Validate quyền review (b_trigger_func_proc.sql)
--   - trg_after_review_insert: Auto update ratingPoints (b_trigger_func_proc.sql)
--   - trg_after_review_update: Auto update ratingPoints (b_trigger_func_proc.sql)
--   - trg_before_review_delete_for_rating: Lưu rating trước xóa (b_trigger_func_proc.sql)
--   - trg_after_review_delete: Auto update ratingPoints (b_trigger_func_proc.sql)
-- STORED PROCEDURES:
--   - sp_update_review: Cập nhật review
-- RÀNG BUỘC NGỮ NGHĨA #6: ratingPoints trong khoảng 1-5
-- MỤC ĐÍCH: Lưu đánh giá với rating, auto update location rating
-- ================================================================
CREATE TABLE REVIEW (
    reviewID INT PRIMARY KEY,
    ratingPoints INT NOT NULL,
    CONSTRAINT FK_Review_Feedback FOREIGN KEY (reviewID) REFERENCES FEEDBACK(fbID) ON DELETE CASCADE,
    CONSTRAINT CHK_RatingRange CHECK (ratingPoints BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- COMMENT: Bình luận (kế thừa FEEDBACK)
-- ================================================================
-- PRIMARY KEY: commentID (cũng là FK to FEEDBACK)
-- FOREIGN KEY:
--   - commentID -> FEEDBACK(fbID) ON DELETE CASCADE
-- MỤC ĐÍCH: Lưu bình luận của users
-- ================================================================
CREATE TABLE COMMENT (
    commentID INT PRIMARY KEY,
    role VARCHAR(50),
    content TEXT NOT NULL,
    CONSTRAINT FK_Comment_Feedback FOREIGN KEY (commentID) REFERENCES FEEDBACK(fbID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- UTILITY_HAS_IMAGE: Ảnh của utility (M-N)
-- ================================================================
-- PRIMARY KEY: (utility, imageID) - Composite
-- FOREIGN KEYS:
--   - utility -> UTILITY(utility) ON DELETE CASCADE
--   - imageID -> IMAGE(imageID) ON DELETE CASCADE
-- MỤC ĐÍCH: Gán ảnh cho utilities
-- ================================================================
CREATE TABLE UTILITY_HAS_IMAGE (
    utility INT NOT NULL,
    imageID INT NOT NULL,
    PRIMARY KEY (utility, imageID),
    CONSTRAINT FK_UImg_Utility FOREIGN KEY (utility) REFERENCES UTILITY(utility) ON DELETE CASCADE,
    CONSTRAINT FK_UImg_Image FOREIGN KEY (imageID) REFERENCES IMAGE(imageID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- FB_HAS_IMAGE: Ảnh trong feedback (M-N)
-- ================================================================
-- PRIMARY KEY: (fbID, imageID) - Composite
-- FOREIGN KEYS:
--   - fbID -> FEEDBACK(fbID) ON DELETE CASCADE
--   - imageID -> IMAGE(imageID) ON DELETE CASCADE
-- MỤC ĐÍCH: Gán ảnh cho feedback (review/comment có thể kèm ảnh)
-- ================================================================
CREATE TABLE FB_HAS_IMAGE (
    fbID INT NOT NULL,
    imageID INT NOT NULL,
    PRIMARY KEY (fbID, imageID),
    CONSTRAINT FK_FBImg_Feedback FOREIGN KEY (fbID) REFERENCES FEEDBACK(fbID) ON DELETE CASCADE,
    CONSTRAINT FK_FBImg_Image FOREIGN KEY (imageID) REFERENCES IMAGE(imageID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- PRODUCT_HAS_IMAGE: Ảnh của product (M-N)
-- ================================================================
-- PRIMARY KEY: (productID, imageID) - Composite
-- FOREIGN KEYS:
--   - productID -> PRODUCT(productID) ON DELETE CASCADE
--   - imageID -> IMAGE(imageID) ON DELETE CASCADE
-- MỤC ĐÍCH: Gán ảnh cho products (ảnh phòng, bàn, vé...)
-- ================================================================
CREATE TABLE PRODUCT_HAS_IMAGE (
    productID INT NOT NULL,
    imageID INT NOT NULL,
    PRIMARY KEY (productID, imageID),
    CONSTRAINT FK_PImg_Product FOREIGN KEY (productID) REFERENCES PRODUCT(productID) ON DELETE CASCADE,
    CONSTRAINT FK_PImg_Image FOREIGN KEY (imageID) REFERENCES IMAGE(imageID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- ENTERTAINMENT_VENUE_DUE: Giờ hoạt động venue
-- ================================================================
-- PRIMARY KEY: (EVID, dayOfWeek, startTime, endTime) - Composite
-- FOREIGN KEY:
--   - EVID -> ENTERTAINMENT_VENUE(EVID) ON DELETE CASCADE
-- CHECK CONSTRAINTS:
--   - CHK_VenueTime: endTime > startTime
--   - CHK_VenueDayOfWeek: dayOfWeek ∈ {'Monday', ..., 'Sunday', 'Daily'}
-- MỤC ĐÍCH: Lưu giờ hoạt động của entertainment venues
-- ================================================================
CREATE TABLE ENTERTAINMENT_VENUE_DUE (
    EVID INT NOT NULL,
    dayOfWeek VARCHAR(50) NOT NULL,
    endTime TIME NOT NULL,
    startTime TIME NOT NULL,
    PRIMARY KEY (EVID, dayOfWeek, startTime, endTime),
    CONSTRAINT FK_VD_Venue FOREIGN KEY (EVID) REFERENCES ENTERTAINMENT_VENUE(EVID) ON DELETE CASCADE,
    CONSTRAINT CHK_VenueTime CHECK (endTime > startTime),
    CONSTRAINT CHK_VenueDayOfWeek CHECK (dayOfWeek IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Daily'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- FB_LIKES: Thích feedback (M-N)
-- ================================================================
-- PRIMARY KEY: (userID, fbID) - Composite
-- FOREIGN KEYS:
--   - userID -> USER_ACCOUNT(userID)
--   - fbID -> FEEDBACK(fbID)
-- TRIGGERS LIÊN QUAN:
--   - trg_after_like_insert: Auto increment likeCount (b_trigger_func_proc.sql)
--   - trg_after_like_delete: Auto decrement likeCount (b_trigger_func_proc.sql)
-- MỤC ĐÍCH: Lưu likes của users cho feedback, auto update count
-- ================================================================
CREATE TABLE FB_LIKES (
    userID INT NOT NULL,
    fbID INT NOT NULL,
    PRIMARY KEY (userID, fbID),
    CONSTRAINT FK_Like_User FOREIGN KEY (userID) REFERENCES USER_ACCOUNT(userID),
    CONSTRAINT FK_Like_Feedback FOREIGN KEY (fbID) REFERENCES FEEDBACK(fbID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- COMMENTS_TO: Cây comment (parent-child)
-- ================================================================
-- PRIMARY KEY: commentID
-- FOREIGN KEYS:
--   - commentID -> COMMENT(commentID)
--   - parentID -> FEEDBACK(fbID) - Comment có thể reply feedback khác
-- MỤC ĐÍCH: Tạo cấu trúc cây cho comments (nested comments)
-- ================================================================
CREATE TABLE COMMENTS_TO (
    commentID INT PRIMARY KEY,
    parentID INT NOT NULL,
    CONSTRAINT FK_CT_Comment FOREIGN KEY (commentID) REFERENCES COMMENT(commentID),
    CONSTRAINT FK_CT_Parent FOREIGN KEY (parentID) REFERENCES FEEDBACK(fbID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- File này bây giờ đã HOÀN CHỈNH với TẤT CẢ các bảng!
-- ================================================================



-- ================================================================
-- PERFORMANCE INDICES
-- ================================================================
CREATE INDEX idx_location_owner ON LOCATION(ownerID);
CREATE INDEX idx_location_type ON LOCATION(locType);
CREATE INDEX idx_location_province ON LOCATION(province);
CREATE INDEX idx_location_status ON LOCATION(status);
CREATE INDEX idx_feedback_location ON FEEDBACK(locID);
CREATE INDEX idx_feedback_user ON FEEDBACK(userID);

SELECT 'File a_create_table_DOCUMENTED.sql - Schema với CHÚ THÍCH CHI TIẾT!' as message;
