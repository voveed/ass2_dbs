CREATE DATABASE IF NOT EXISTS VIVUVIET CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE VIVUVIET;

CREATE TABLE USER_ACCOUNT (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    mail VARCHAR(255) NOT NULL UNIQUE,
    fullName VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    district VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    DOB DATE,
    role VARCHAR(50) NOT NULL,
    CONSTRAINT CHK_UserRole CHECK (role IN ('ADMIN', 'TOURIST', 'OWNER')),
    CONSTRAINT CHK_EmailFormat CHECK (mail REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$') 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE USER_PHONE ( 
    userID INT NOT NULL,
    phoneNumber VARCHAR(15) NOT NULL,
    PRIMARY KEY (userID, phoneNumber),
    CONSTRAINT FK_UserPhone_User FOREIGN KEY (userID) REFERENCES USER_ACCOUNT(userID) ON DELETE CASCADE,
    CONSTRAINT CHK_PhoneFormat CHECK (phoneNumber REGEXP '^[0-9]{10,15}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IMAGE (
    imageID INT AUTO_INCREMENT PRIMARY KEY,
    URL VARCHAR(255) NOT NULL UNIQUE,  
    caption VARCHAR(500),
    imageType VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE PREFERENCE (
    prefID INT AUTO_INCREMENT PRIMARY KEY,
    prefName VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100),
    prefDescription TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE UTILITY (
    utility INT AUTO_INCREMENT PRIMARY KEY,
    uName VARCHAR(255) UNIQUE,
    uType VARCHAR(100),
    UDescription TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
    CONSTRAINT CHK_LimitVal CHECK (limitVal >= 0), -- THÊM RÀNG BUỘC LỚN HƠN 0
    CONSTRAINT CHK_VoucherRank CHECK (rankRequirement >= 0 AND rankRequirement <= 4)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ADMINISTRATOR (
    adminID INT PRIMARY KEY,
    jobName VARCHAR(100) NOT NULL,
    permissionLevel VARCHAR(100) NOT NULL,
    CONSTRAINT FK_Admin_User FOREIGN KEY (adminID) REFERENCES USER_ACCOUNT(userID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE BUSINESS_OWNER (
    BOID INT PRIMARY KEY,
    taxCode VARCHAR(100) NOT NULL UNIQUE,
    auStatus VARCHAR(50) DEFAULT 'PENDING',
    CONSTRAINT FK_BusinessOwner_User FOREIGN KEY (BOID) REFERENCES USER_ACCOUNT(userID) ON DELETE CASCADE,
    CONSTRAINT CHK_OwnerAuthStatus CHECK (auStatus IN ('PENDING', 'VERIFIED', 'REJECTED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE TOURIST (
    touristID INT PRIMARY KEY,
    nationality VARCHAR(100) NOT NULL,
    legalID VARCHAR(100) NOT NULL,
    loyaltypoints INT DEFAULT 0,
    totalSpent DECIMAL(18, 2) DEFAULT 0,
    -- Quy ước: 0=Bronze, 1=Silver, 2=Gold, 3=Platinum, 4=Diamond
    rankLevel INT DEFAULT 0, 
    -- `rank` VARCHAR(50) DEFAULT 'Bronze',
    lastPreferenceUpdate DATETIME DEFAULT NOW(),
    CONSTRAINT FK_Tourist_User FOREIGN KEY (touristID) REFERENCES USER_ACCOUNT(userID) ON DELETE CASCADE,
    CONSTRAINT CHK_TouristRank CHECK (rankLevel BETWEEN 0 AND 4),
    CONSTRAINT CHK_TouristLoyaltyPoints CHECK (loyaltypoints >= 0),
    CONSTRAINT CHK_TouristTotalSpent CHECK (totalSpent >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ROOMTYPE (
    roomTypeID INT PRIMARY KEY,
    capacity INT NOT NULL,
    CONSTRAINT FK_RoomType_Product FOREIGN KEY (roomTypeID) REFERENCES PRODUCT(productID) ON DELETE CASCADE,
    CONSTRAINT CHK_RoomCapacity CHECK (capacity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE TABLE_TYPE (
    tableTypeID INT PRIMARY KEY,
    numOfCustomers INT NOT NULL,
    viewDescription VARCHAR(255),
    CONSTRAINT FK_TableType_Product FOREIGN KEY (tableTypeID) REFERENCES PRODUCT(productID) ON DELETE CASCADE,
    CONSTRAINT CHK_TableCapacity CHECK (numOfCustomers > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE TICKET_TYPE (
    ticketTypeID INT PRIMARY KEY,
    validity VARCHAR(100),
    audienceType VARCHAR(100),
    CONSTRAINT FK_TicketType_Product FOREIGN KEY (ticketTypeID) REFERENCES PRODUCT(productID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE LOCATION (
    locID INT AUTO_INCREMENT PRIMARY KEY,
    locNo VARCHAR(50), 
    street VARCHAR(255) NOT NULL, 
    ward VARCHAR(100),
    district VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    priceLev VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    description TEXT,
    locName VARCHAR(255) NOT NULL UNIQUE,
    locType VARCHAR(50) NOT NULL,
    ownerID INT NOT NULL,
    ratingPoints FLOAT DEFAULT 0,
    hotnessScore FLOAT DEFAULT 0,
    CONSTRAINT FK_Location_BusinessOwner FOREIGN KEY (ownerID) REFERENCES BUSINESS_OWNER(BOID),
    CONSTRAINT CHK_LocationType CHECK (locType IN ('HOTEL', 'RESTAURANT', 'VENUE')),
    CONSTRAINT CHK_LocationPriceLev CHECK (priceLev IS NULL OR priceLev IN ('BUDGET', 'MODERATE', 'UPSCALE', 'LUXURY')),
    CONSTRAINT CHK_LocationStatus CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING')),
    CONSTRAINT CHK_LocationRating CHECK (ratingPoints >= 0 AND ratingPoints <= 5),
    CONSTRAINT CHK_LocationHotness CHECK (hotnessScore >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE USER_ACCOUNT_HAS_IMAGE (
    userID INT PRIMARY KEY,
    imageID INT NOT NULL UNIQUE,
    CONSTRAINT FK_UserImage_User FOREIGN KEY (userID) REFERENCES USER_ACCOUNT(userID) ON DELETE CASCADE,
    CONSTRAINT FK_UserImage_Image FOREIGN KEY (imageID) REFERENCES IMAGE(imageID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE TOURIST_HAS_PREFERENCE (
    prefID INT NOT NULL,
    touristID INT NOT NULL,
    PRIMARY KEY (prefID, touristID),
    CONSTRAINT FK_TPref_Preference FOREIGN KEY (prefID) REFERENCES PREFERENCE(prefID),
    CONSTRAINT FK_TPref_Tourist FOREIGN KEY (touristID) REFERENCES TOURIST(touristID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE HOTEL (
    hotelID INT PRIMARY KEY,
    officialStarRating FLOAT DEFAULT 0,
    standardCheckinTime TIME NOT NULL,
    standardCheckOutTime TIME NOT NULL,
    CONSTRAINT FK_Hotel_Location FOREIGN KEY (hotelID) REFERENCES LOCATION(locID) ON DELETE CASCADE,
    CONSTRAINT CHK_HotelStars CHECK (officialStarRating >= 0 AND officialStarRating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE RESTAURANT (
    restaurantID INT PRIMARY KEY,
    cuisineType VARCHAR(100) NOT NULL,
    menuURL VARCHAR(2048),
    CONSTRAINT FK_Restaurant_Location FOREIGN KEY (restaurantID) REFERENCES LOCATION(locID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ENTERTAINMENT_VENUE (
    EVID INT PRIMARY KEY,
    attractionType VARCHAR(100) NOT NULL,
    targetAudience VARCHAR(100),
    CONSTRAINT FK_Venue_Location FOREIGN KEY (EVID) REFERENCES LOCATION(locID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE LOC_HAS_UTILITY (
    utility INT NOT NULL,
    locID INT NOT NULL,
    PRIMARY KEY (utility, locID),
    CONSTRAINT FK_LU_Utility FOREIGN KEY (utility) REFERENCES UTILITY(utility) ON DELETE CASCADE,
    CONSTRAINT FK_LU_Location FOREIGN KEY (locID) REFERENCES LOCATION(locID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE LOCATION_HAS_PREFERENCE (
    prefID INT NOT NULL,
    locID INT NOT NULL,
    PRIMARY KEY (prefID, locID),
    CONSTRAINT FK_LPref_Preference FOREIGN KEY (prefID) REFERENCES PREFERENCE(prefID) ON DELETE CASCADE,
    CONSTRAINT FK_LPref_Location FOREIGN KEY (locID) REFERENCES LOCATION(locID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE LOCATION_HAS_PRODUCT (
    productID INT NOT NULL,
    locID INT NOT NULL,
    PRIMARY KEY (productID, locID),
    CONSTRAINT FK_LP_Product FOREIGN KEY (productID) REFERENCES PRODUCT(productID) ON DELETE CASCADE,
    CONSTRAINT FK_LP_Location FOREIGN KEY (locID) REFERENCES LOCATION(locID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

/* ================================================================= */
/* 6. CẤP 4 & 5: BẢNG PHỤ TRỢ VÀ FEEDBACK (ĐÃ SỬA LỖI M-N)           */
/* ================================================================= */
CREATE TABLE REVIEW (
    reviewID INT PRIMARY KEY,
    ratingPoints INT NOT NULL,
    CONSTRAINT FK_Review_Feedback FOREIGN KEY (reviewID) REFERENCES FEEDBACK(fbID) ON DELETE CASCADE,
    CONSTRAINT CHK_RatingRange CHECK (ratingPoints BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE COMMENT (
    commentID INT PRIMARY KEY,
    role VARCHAR(50),
    content TEXT NOT NULL,
    CONSTRAINT FK_Comment_Feedback FOREIGN KEY (commentID) REFERENCES FEEDBACK(fbID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE UTILITY_HAS_IMAGE (
    utility INT NOT NULL,
    imageID INT NOT NULL,
    PRIMARY KEY (utility, imageID),
    CONSTRAINT FK_UImg_Utility FOREIGN KEY (utility) REFERENCES UTILITY(utility) ON DELETE CASCADE,
    CONSTRAINT FK_UImg_Image FOREIGN KEY (imageID) REFERENCES IMAGE(imageID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE FB_HAS_IMAGE (
    fbID INT NOT NULL,
    imageID INT NOT NULL,
    PRIMARY KEY (fbID, imageID),
    CONSTRAINT FK_FBImg_Feedback FOREIGN KEY (fbID) REFERENCES FEEDBACK(fbID) ON DELETE CASCADE,
    CONSTRAINT FK_FBImg_Image FOREIGN KEY (imageID) REFERENCES IMAGE(imageID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE LOC_HAS_IMAGE (
    locID INT NOT NULL,
    imageID INT NOT NULL,
    PRIMARY KEY (locID, imageID),
    CONSTRAINT FK_LImg_Location FOREIGN KEY (locID) REFERENCES LOCATION(locID) ON DELETE CASCADE,
    CONSTRAINT FK_LImg_Image FOREIGN KEY (imageID) REFERENCES IMAGE(imageID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE PRODUCT_HAS_IMAGE (
    productID INT NOT NULL,
    imageID INT NOT NULL,
    PRIMARY KEY (productID, imageID),
    CONSTRAINT FK_PImg_Product FOREIGN KEY (productID) REFERENCES PRODUCT(productID) ON DELETE CASCADE,
    CONSTRAINT FK_PImg_Image FOREIGN KEY (imageID) REFERENCES IMAGE(imageID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE FB_LIKES (
    userID INT NOT NULL,
    fbID INT NOT NULL,
    PRIMARY KEY (userID, fbID),
    CONSTRAINT FK_Like_User FOREIGN KEY (userID) REFERENCES USER_ACCOUNT(userID),
    CONSTRAINT FK_Like_Feedback FOREIGN KEY (fbID) REFERENCES FEEDBACK(fbID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE COMMENTS_TO (
    commentID INT PRIMARY KEY,
    parentID INT NOT NULL,
    CONSTRAINT FK_CT_Comment FOREIGN KEY (commentID) REFERENCES COMMENT(commentID),
    CONSTRAINT FK_CT_Parent FOREIGN KEY (parentID) REFERENCES FEEDBACK(fbID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- PERFORMANCE INDICES
-- ================================================================
CREATE INDEX idx_location_owner ON LOCATION(ownerID);
CREATE INDEX idx_location_type ON LOCATION(locType);
CREATE INDEX idx_location_province ON LOCATION(province);
CREATE INDEX idx_location_status ON LOCATION(status);
CREATE INDEX idx_reservation_tourist ON RESERVATION(touristID);
CREATE INDEX idx_reservation_status ON RESERVATION(status);
CREATE INDEX idx_feedback_location ON FEEDBACK(locID);
CREATE INDEX idx_feedback_user ON FEEDBACK(userID);
CREATE INDEX idx_feedback_type ON FEEDBACK(feedbackType);
CREATE INDEX idx_transaction_reservation ON `TRANSACTION`(reservationID);
CREATE INDEX idx_booking_details_product ON BOOKING_DETAILS(productID);
