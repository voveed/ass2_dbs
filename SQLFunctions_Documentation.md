# VIVUVIET - SQL Functions & Procedures Documentation

## 📋 Table of Contents

1. [2.1 - LOCATION CRUD Stored Procedures ](#21---location-crud-stored-procedures)
2. [2.2 - Constraints & Triggers](#22---constraints--triggers)
3. [2.3 - Additional Stored Procedures](#23---additional-stored-procedures)
4. [2.4 - Functions](#24---functions)
5. [Example Queries](#example-queries)
6. [Data Justification](#data-justification)

---

## 2.1 - LOCATION CRUD Stored Procedures

### sp_add_location
**Purpose:** Allows verified Business Owners to add new locations to the system.

**Parameters:**
- `p_locName` (VARCHAR 255): Location name (required, must be unique)
- `p_street` (VARCHAR 255): Street address (required)
- `p_district` (VARCHAR 100): District name (required)
- `p_province` (VARCHAR 100): Province/city name (required)
- `p_locType` (VARCHAR 50): Type of location - 'HOTEL', 'RESTAURANT', or 'VENUE' (required)
- `p_ownerID` (INT): Business Owner ID (required, must be VERIFIED)
- `p_locNo` (VARCHAR 50): Street number (optional)
- `p_ward` (VARCHAR 100): Ward name (optional)
- `p_priceLev` (VARCHAR 50): Price level - 'Bình dân', 'Trung bình', 'Cao cấp', 'Xa xỉ' (optional)
- `p_description` (TEXT): Location description (optional)

**Validation Rules:**
1. ✓ Location name cannot be empty → "Lỗi: Tên địa địểm không được để trống."
2. ✓ Location name must be unique → "Lỗi: Tên địa điểm đã tồn tại. Vui lòng chọn tên khác."
3. ✓ Street, district, province are mandatory → Specific error for each field
4. ✓ Location type must be one of: HOTEL, RESTAURANT, VENUE → "Lỗi: Loại địa điểm phải là HOTEL, RESTAURANT hoặc VENUE."
5. ✓ Price level must be valid if provided → "Lỗi: Mức giá phải là: Bình dân, Trung bình, Cao cấp hoặc Xa xỉ."
6. ✓ Owner must exist and have role OWNER → "Lỗi: Chủ sở hữu (ownerID) không tồn tại."
7. ✓ Owner must be VERIFIED by admin → "Lỗi: Tài khoản chủ sở hữu chưa được xác thực. Vui lòng chờ admin duyệt."

**Example Usage:**
```sql
-- Successful addition
CALL sp_add_location(
    'Khách sạn Hoa Sữa',
    '123 Lê Lợi',
    'Quận 1',
    'TP. Hồ Chí Minh',
    'HOTEL',
    6,  -- ownerID (must be VERIFIED)
    '123',
    'Phường Bến Thành',
    'Cao cấp',
    'Khách sạn 4 sao tại trung tâm thành phố'
);
-- Returns: { locID: 31, message: 'Thêm địa điểm thành công!' }

-- Error: Duplicate name
CALL sp_add_location('InterContinental Danang', ..., 6, ...);
-- Returns: Error 45000: "Lỗi: Tên địa điểm đã tồn tại. Vui lòng chọn tên khác."

-- Error: Unverified owner
CALL sp_add_location('New Hotel', ..., 15, ...);  -- Owner 15 has auStatus='PENDING'
-- Returns: Error 45000: "Lỗi: Tài khoản chủ sở hữu chưa được xác thực..."
```

---

### sp_update_location
**Purpose:** Allows Business Owners to update their own locations (partial updates supported).

**Parameters:**
- `p_locID` (INT): Location ID to update (required)
- `p_ownerID` (INT): Owner ID for verification (required)
- `p_locName` (VARCHAR 255): New location name (optional)
- `p_street` (VARCHAR 255): New street (optional)
- `p_district` (VARCHAR 100): New district (optional)
- `p_province` (VARCHAR 100): New province (optional)
- `p_locNo` (VARCHAR 50): New street number (optional)
- `p_ward` (VARCHAR 100): New ward (optional)
- `p_priceLev` (VARCHAR 50): New price level (optional)
- `p_description` (TEXT): New description (optional)

**Validation Rules:**
1. ✓ Location must exist → "Lỗi: Không tìm thấy địa điểm với ID này."
2. ✓ Owner must match → "Lỗi: Bạn không có quyền sửa địa điểm này."
3. ✓ New name must be unique if provided → "Lỗi: Tên địa điểm đã tồn tại..."
4. ✓ Price level must be valid if provided → Same validation as add

**Example Usage:**
```sql
-- Update price level and description only
CALL sp_update_location(
    1,      -- locID
    6,      -- ownerID
    NULL,   -- Keep existing name
    NULL,   -- Keep existing street
    NULL,   -- Keep existing district
    NULL,   -- Keep existing province
    NULL,   -- Keep existing locNo
    NULL,   -- Keep existing ward
    'Xa xỉ',  -- Update price level
    'Đã nâng cấp lên 6 sao' -- Update description
);
-- Returns: { message: 'Cập nhật địa điểm thành công!' }

-- Error: Not owner
CALL sp_update_location(1, 7, ...);  -- User 7 doesn't own Location 1
-- Returns: Error 45000: "Lỗi: Bạn không có quyền sửa địa điểm này."
```

---

### sp_delete_location
**Purpose:** Safely delete (deactivate) locations with business logic checks.

**Parameters:**
- `p_locID` (INT): Location ID to delete (required)
- `p_ownerID` (INT): Owner ID for verification (required)

**Delete Logic:**
- **NOT allowed** when location has PENDING or CONFIRMED reservations
  → "Lỗi: Không thể xóa địa điểm đang có đơn đặt chỗ đang xử lý. Vui lòng xử lý hết đơn hàng trước."
- **Allowed** when:
  - No active reservations
  - Only COMPLETED or CANCELLED reservations exist
- **Action:** Soft delete (sets status = 'INACTIVE', keeps data)

**Why Soft Delete:**
- Preserves historical data for reporting
- Maintains referential integrity
- Allows reactivation if needed
- Prevents breaking completed reservations

**Example Usage:**
```sql
-- Successful deletion
CALL sp_delete_location(30, 13);
-- Returns: { 
--   message: 'Đã vô hiệu hóa địa điểm thành công!',
--   note: 'Địa điểm không còn hiển thị cho khách hàng nhưng dữ liệu vẫn được lưu trữ.'
-- }

-- Error: Has pending bookings
CALL sp_delete_location(1, 6);  -- Location 1 has PENDING reservation
-- Returns: Error 45000: "Lỗi: Không thể xóa địa điểm đang có đơn đặt chỗ đang xử lý..."
```

---

### sp_get_locations_by_owner
**Purpose:** Retrieve all locations owned by a Business Owner with filtering, sorting, and statistics.

**Parameters:**
- `p_ownerID` (INT): Owner ID (required)
- `p_statusFilter` (VARCHAR 50): Filter by status ('ACTIVE', 'INACTIVE', NULL for all) (optional)
- `p_typeFilter` (VARCHAR 50): Filter by type ('HOTEL', 'RESTAURANT', 'VENUE', NULL for all) (optional)
- `p_searchQuery` (VARCHAR 255): Search in name, district, province (optional)
- `p_sortBy` (VARCHAR 50): Sort column ('name', 'rating', 'hotness', 'createdDate') (optional, default 'createdDate')
- `p_limit` (INT): Page size (optional, default 20)
- `p_offset` (INT): Offset for pagination (optional, default 0)

**Returns:** Result set with columns:
- `locID`, `locName`, `locType`, `street`, `district`, `province`, `priceLev`, `status`
- `ratingPoints`, `hotnessScore`, `description`, `heroImageURL`
- `totalReservations` - Count of all reservations
- `reviewCount` - Count of reviews
- `totalRevenue` - Sum of completed transactions (using fn_get_location_revenue)

**Example Usage:**
```sql
-- Get all ACTIVE hotels for owner 6, sorted by revenue
CALL sp_get_locations_by_owner(
    6,          -- ownerID
    'ACTIVE',   -- statusFilter
    'HOTEL',    -- typeFilter
    NULL,       -- no search
    'hotness',  -- sortBy
    10,         -- limit
    0           -- offset
);

-- Search for locations with 'Saigon' in name/address
CALL sp_get_locations_by_owner(6, NULL, NULL, 'Saigon', 'name', 20, 0);
```

---

## 2.2 - Constraints & Triggers

### CHECK Constraints

| Table | Constraint Name | Rule | Rationale |
|-------|----------------|------|-----------|
| USER_ACCOUNT | CHK_UserRole | role IN ('ADMIN', 'TOURIST', 'OWNER') | Ensures only valid user roles |
| USER_ACCOUNT | CHK_EmailFormat | mail REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' | Validates email format |
| BUSINESS_OWNER | CHK_OwnerAuthStatus | auStatus IN ('PENDING', 'VERIFIED', 'REJECTED') | Tracks verification status |
| TOURIST | CHK_TouristRank | rank IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond') | Valid loyalty ranks only |
| TOURIST | CHK_TouristLoyaltyPoints | loyaltypoints >= 0 | Points cannot be negative |
| TOURIST | CHK_TouristTotalSpent | totalSpent >= 0 | Spending cannot be negative |
| VOUCHER | CHK_VoucherDates | expDate > startDate | End date must be after start |
| VOUCHER | CHK_VoucherDiscount | discountPercentage > 0 AND <= 1 | Discount is 0-100% |
| VOUCHER | CHK_VoucherSlots | slots > 0 | At least one slot required |
| VOUCHER | CHK_VoucherRank | rankRequirement >= 0 AND <= 4 | Valid rank requirement (0=Bronze...4=Diamond) |
| LOCATION | CHK_LocationType | locType IN ('HOTEL', 'RESTAURANT', 'VENUE') | Only supported types |
| LOCATION | CHK_LocationPriceLev | priceLev IN ('Bình dân', 'Trung bình', 'Cao cấp', 'Xa xỉ') OR NULL | Valid price levels (Vietnamese) |
| LOCATION | CHK_LocationStatus | status IN ('ACTIVE', 'INACTIVE', 'PENDING') | Valid statuses |
| LOCATION | CHK_LocationRating | ratingPoints >= 0 AND <= 5 | Ratings are 0-5 stars |
| ROOMTYPE | CHK_RoomCapacity | capacity > 0 | At least 1 person per room|
| TABLE_TYPE | CHK_TableCapacity | numOfCustomers > 0 | At least 1 customer per table |
| HOTEL | CHK_HotelStars | officialStarRating >= 0 AND <= 5 | Hotel stars are 0-5 |
| RESERVATION | CHK_ReservationStatus | status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') | Valid reservation states |
| BOOKING_DETAILS | CHK_BookingDates | checkoutDateTime > checkingDateTime | Check-out after check-in |
| FEEDBACK | CHK_LikeCount | likeCount >= 0 | Likes cannot be negative |
| FEEDBACK | CHK_FeedbackType | feedbackType IN ('REVIEW', 'COMMENT') | Only two types |
| REVIEW | CHK_RatingRange | ratingPoints BETWEEN 1 AND 5 | Reviews are 1-5 stars |
| ENTERTAINMENT_VENUE_DUE | CHK_VenueTime | endTime > startTime | Events end after they start |
| ENTERTAINMENT_VENUE_DUE | CHK_VenueDayOfWeek | dayOfWeek IN ('Monday',...'Sunday', 'Daily') | Valid day names |

### Triggers

#### 1. Like Count Auto-Update
**Trigger:** `trg_after_like_insert` and `trg_after_like_delete`

**When:** AFTER INSERT/DELETE on FB_LIKES

**Action:** Automatically updates FEEDBACK.likeCount
```sql
-- When user likes
INSERT INTO FB_LIKES (userID, fbID) VALUES (16, 1);
-- Trigger automatically runs: UPDATE FEEDBACK SET likeCount = likeCount + 1 WHERE fbID = 1

-- When user unlikes
DELETE FROM FB_LIKES WHERE userID = 16 AND fbID = 1;
-- Trigger automatically runs: UPDATE FEEDBACK SET likeCount = likeCount - 1 WHERE fbID = 1
```

**Why needed:** Maintains data consistency. likeCount is a derived attribute that should always equal COUNT(*) from FB_LIKES.

---

#### 2. Location Rating Auto-Update
**Triggers:** `trg_after_review_insert`, `trg_after_review_update`, `trg_before_review_delete`, `trg_after_review_delete`

**When:** AFTER INSERT/UPDATE/DELETE on REVIEW

**Action:** Calls sp_update_location_rating to recalculate average rating
```sql
-- When new review added
INSERT INTO REVIEW (reviewID, ratingPoints) VALUES (101, 5);
-- Trigger calculates: AVG(ratingPoints) for that location and updates LOCATION.ratingPoints
```

**Why needed:** ratingPoints is a derived attribute (average of all review ratings). Must stay in sync.

---

#### 3. Reservation Total Auto-Update
**Triggers:** `trg_after_booking_details_insert`, `trg_after_booking_details_update`, `trg_after_booking_details_delete`

**When:** AFTER INSERT/UPDATE/DELETE on BOOKING_DETAILS

**Action:** Automatically recalculates RESERVATION.totalAmount and numOfItems
```sql
-- Uses fn_calculate_reservation_total which loops through all items
UPDATE RESERVATION 
SET totalAmount = fn_calculate_reservation_total(reservationID),
    numOfItems = (SELECT COUNT(*) FROM BOOKING_DETAILS WHERE ...)
```

**Why needed:** Ensures totalAmount always equals SUM(quantity * unitPrice) from booking details.

---

#### 4. Tourist Spending & Rank Auto-Update
**Trigger:** `trg_after_transaction_completed`

**When:** AFTER UPDATE on TRANSACTION (when status changes to 'COMPLETED')

**Action:**
1. Updates RESERVATION.totalPaid with transaction amount
2. Updates TOURIST.totalSpent
3. Calls fn_get_tourist_rank to update TOURIST.rank
```sql
-- When payment completes
UPDATE TRANSACTION SET status = 'COMPLETED' WHERE transactionID = 1;
-- Trigger updates tourist's total spending and recalculates rank
```

**Why needed:** totalSpent and rank are derived attributes based on completed transactions.

---

#### 5. Review Permission Check
**Trigger:** `trg_before_review_insert_check_completed`

**When:** BEFORE INSERT on FEEDBACK (when feedbackType = 'REVIEW')

**Action:** Verifies user has completed a reservation at this location
```sql
-- Check if tourist has COMPLETED booking
SELECT COUNT(*) FROM RESERVATION R
JOIN BOOKING_DETAILS BD ON ...
WHERE touristID = NEW.userID AND locID = NEW.locID AND status = 'COMPLETED'

-- If count = 0, raise error
```

**Why needed:** Business rule - only customers who visited can review (verified reviews).

---

#### 6. Voucher Validity Check
**Trigger:** `trg_check_voucher_validity`

**When:** BEFORE INSERT on RESERVATION (when voucherID is provided)

**Action:** Validates voucher:
- Not expired (expDate >= CURDATE())
- Not before start (startDate <= CURDATE())
- Has available slots (remaining_slots > 0)
- User has sufficient rank

**Why needed:** Prevents invalid voucher usage (better than checking in application code).

---

#### 7. Voucher Slot Auto-Decrement
**Trigger:** `trg_use_voucher_slot`

**When:** AFTER INSERT on RESERVATION (when voucherID is provided)

**Action:** Decrements used_slots
```sql
UPDATE VOUCHER SET used_slots = used_slots + 1 WHERE voucherID = NEW.voucherID
```

**Why needed:** Auto-track voucher usage. remaining_slots is computed column that depends on used_slots.

---

### Triggers NOT Implemented with CHECK (As per BTL2 requirements)

BTL2 states: "những ràng buộc nào có thể kiểm tra trong câu lệnh tạo bảng thì không dùng trigger để kiểm tra."

✅ **Using CHECK instead of Trigger (correct approach):**
- Email format validation
- Price level values
- Reservation status values
- Rating ranges (1-5)
- Dates (checkout > checkin)

❌ **Must use Trigger (cannot use CHECK):**
- Review permission (requires join query)
- Like count updates (requires aggregation)
- Rating average (requires aggregation)
- Voucher validation (requires date comparison and joins)
- Tourist rank updates (depends on spending threshold logic)

---

## 2.3 - Additional Stored Procedures

### sp_search_locations_by_criteria (Enhanced)
**Purpose:** Advanced search with multiple filters and sorting options.

**Parameters:**
- `p_province`, `p_locType`, `p_prefName` - Basic filters
- `p_minRating` - Minimum star rating
- `p_maxPrice` - Maximum price level ('Bình dân', 'Trung bình', etc.)
- `p_searchQuery` - Keyword search in name/description
- `p_sortBy` - Sort ('hotness', 'rating', 'name', 'price_low', 'price_high')
- `p_limit`, `p_offset` - Pagination

**Uses GROUP BY:** Groups by L.locID (due to M-N join with LOCATION_HAS_PREFERENCE)

**Example:**
```sql
-- Find high-rated beach resorts in Nha Trang
CALL sp_search_locations_by_criteria(
    'Khánh Hòa',     -- province
    'HOTEL',         -- locType
    'Biển',          -- preference
    4.0,             -- minRating
    NULL,            -- any price
    'resort',        -- search keyword
    'rating',        -- sort by rating
    10, 0            -- limit, offset
);
```

---

### sp_get_owner_statistics (With GROUP BY, HAVING, ORDER BY)
**Purpose:** Generate revenue and performance reports for Business Owners.

**Parameters:**
- `p_ownerID` - Owner to report on
- `p_startDate`, `p_endDate` - Date range filter (optional)
- `p_minRevenue` - Filter locations with revenue >= amount

**SQL Features Demonstrated:**
```sql
GROUP BY L.locID, L.locName, L.locType, L.priceLev
HAVING totalRevenue >= p_minRevenue  -- Filter aggregated results
ORDER BY totalRevenue DESC, averageRating DESC
```

**Returns:** Per-location statistics:
- Total completed bookings
- Pending bookings count
- Total revenue (SUM of completed transactions)
- Average rating (AVG of review ratings)
- Total review count

**Example:**
```sql
-- Get performance for locations earning > 10M in November
CALL sp_get_owner_statistics(
    6,                  -- ownerID
    '2025-11-01',      -- startDate
    '2025-11-30',      -- endDate
    10000000           -- minRevenue
);
```

**Explanation of GROUP BY/HAVING:**
- **GROUP BY:** Groups rows by location to calculate per-location totals
- **HAVING:** Filters groups (locations) based on aggregated value (totalRevenue)
  - Unlike WHERE (filters rows before grouping)
  - HAVING filters groups after aggregation
- **ORDER BY:** Sorts final grouped results

---

### sp_update_tourist_preferences_auto
**Purpose:** Auto-refresh tourist preferences every 30 days based on booking behavior.

**Logic:**
1. Check if 30 days have passed since lastPreferenceUpdate
2. Analyze last 30 days of reservations
3. Find top 3 most-frequent preferences from visited locations
4. Add new preferences that tourist doesn't already have
5. Update lastPreferenceUpdate timestamp

**Why needed:** Recommendation system - adapts to changing tourist interests over time.

**Example:**
```sql
-- Manually trigger preference update
CALL sp_update_tourist_preferences_auto(16);
-- Analyzes Tourist 16's bookings and adds new preferences

-- Tourist books: Beach hotels (Biển) × 5, Mountain resorts (Núi) × 3, Luxury (Sang trọng) × 4
-- If tourist doesn't have "Biển" preference yet, it will be added
```

---

### sp_check_and_refresh_preferences
**Purpose:** Wrapper procedure to update ALL tourists (runs via event scheduler).

**How it works:**
```sql
-- Event runs daily
evt_refresh_all_tourist_preferences
  ↓
CALL sp_check_and_refresh_preferences()
  ↓
  For each tourist WHERE DATEDIFF(NOW(), lastPreferenceUpdate) >= 30:
    CALL sp_update_tourist_preferences_auto(touristID)
```

---

## 2.4 - Functions

### fn_calculate_reservation_total (CURSOR + LOOP Example)
**Pattern:** Demonstrates CURSOR iteration with LOOP

```sql
DECLARE details_cursor CURSOR FOR
    SELECT quantity, unitPrice FROM BOOKING_DETAILS WHERE reservationID = p_reservationID;

OPEN details_cursor;

read_loop: LOOP
    FETCH details_cursor INTO item_quantity, item_price;
    IF done THEN LEAVE read_loop; END IF;
    SET total_amount = total_amount + (item_quantity * item_price);
END LOOP;

CLOSE details_cursor;
```

**Why CURSOR:** Processes each booking item one-by-one to calculate total.

**Example:**
```sql
SELECT fn_calculate_reservation_total(1);
-- Returns: 17000000 (sum of all items in reservation 1)
```

---

### fn_get_tourist_rank (IF + QUERY Example)
**Pattern:** Demonstrates IF-ELSEIF logic with query

```sql
SELECT totalSpent INTO total_spent FROM TOURIST WHERE touristID = p_touristID;

IF total_spent >= 50000000 THEN
    SET user_rank = 'Diamond';
ELSEIF total_spent >= 20000000 THEN
    SET user_rank = 'Platinum';
ELSEIF total_spent >= 10000000 THEN
    SET user_rank = 'Gold';
...
```

**Rank Thresholds:**
- Bronze: < 5M VND
- Silver: 5M - 10M
- Gold: 10M - 20M
- Platinum: 20M - 50M
- Diamond: >= 50M

**Example:**
```sql
SELECT fn_get_tourist_rank(16);
-- Returns: 'Silver' (Tourist 16 has spent 7M)
```

---

### fn_calculate_discount
**Pattern:** Simple calculation with conditional logic

**Logic:**
```sql
calculated_discount = totalAmount * discountPercentage

IF limitVal > 0 AND calculated_discount > limitVal THEN
    RETURN limitVal  -- Cap at maximum
ELSE
    RETURN calculated_discount
END IF
```

**Example:**
```sql
SELECT fn_calculate_discount(10000000, 1);
-- Voucher 1: 10% discount, 500k limit
-- 10M × 10% = 1M, but capped at 500k
-- Returns: 500000
```

---

### fn_get_location_revenue (CURSOR + LOOP Example)
**Pattern:** Another CURSOR example, calculates total revenue

```sql
DECLARE revenue_cursor CURSOR FOR
    SELECT T.paidAmount FROM TRANSACTION T
    JOIN RESERVATION R ... JOIN LOCATION_HAS_PRODUCT LHP ...
    WHERE LHP.locID = p_locID AND T.status = 'COMPLETED';

revenue_loop: LOOP
    FETCH revenue_cursor INTO transaction_amount;
    ...
    SET total_revenue = total_revenue + transaction_amount;
END LOOP;
```

**Example:**
```sql
SELECT fn_get_location_revenue(1);
-- Returns: 54000000 (total revenue for Location 1)
```

---

### fn_check_tourist_can_review (IF + QUERY Example)
**Pattern:** Boolean check with query

```sql
SELECT COUNT(*) INTO completed_count
FROM RESERVATION R ... WHERE status = 'COMPLETED';

IF completed_count > 0 THEN
    RETURN TRUE;
ELSE
    RETURN FALSE;
END IF;
```

**Example:**
```sql
SELECT fn_check_tourist_can_review(16, 1);
-- Returns: 1 (TRUE - Tourist 16 completed a booking at Location 1)

SELECT fn_check_tourist_can_review(16, 99);
-- Returns: 0 (FALSE - Tourist 16 never visited Location 99)
```

---

## Example Queries

### Query 1: Business Owner adds a location
```sql
CALL sp_add_location(
    'Khách sạn Mường Thanh Luxury',
    '40 Trần Phú',
    'TP. Nha Trang',
    'Khánh Hòa',
    'HOTEL',
    7,
    '40',
    'Lộc Thọ',
    'Cao cấp',
    'Khách sạn 5 sao ngay bãi biển Nha Trang'
);
```

### Query 2: Update location price level
```sql
CALL sp_update_location(1, 6, NULL, NULL, NULL, NULL, NULL, NULL, 'Xa xỉ', NULL);
```

### Query 3: Get my locations with statistics
```sql
CALL sp_get_locations_by_owner(6, 'ACTIVE', NULL, NULL, 'revenue', 20, 0);
```

### Query 4: Search for budget-friendly restaurants in Hanoi
```sql
CALL sp_search_locations_by_criteria(
    'Hà Nội',          -- province
    'RESTAURANT',      -- type
    NULL,              -- any preference
    3.5,               -- min 3.5 stars
    'Bình dân',        -- budget price
    'phở',             -- search keyword
    'rating',          -- sort by rating
    10, 0
);
```

### Query 5: Get revenue report for November 2025
```sql
CALL sp_get_owner_statistics(6, '2025-11-01', '2025-11-30', 1000000);
```

### Query 6: Calculate total for a reservation
```sql
SELECT fn_calculate_reservation_total(1);
-- Result: 17000000
```

### Query 7: Check tourist rank
```sql
SELECT 
    touristID, 
    fullName, 
    totalSpent, 
    fn_get_tourist_rank(touristID) as calculatedRank,
    `rank` as currentRank
FROM TOURIST T
JOIN USER_ACCOUNT U ON T.touristID = U.userID
WHERE touristID = 16;
```

---

## Data Justification

### Why This Sample Data is Meaningful (Not Generic)

#### 1. Real Vietnamese Tourism Context
✅ **Actual Famous Locations:**
- InterContinental Danang Sun Peninsula (Real 5-star resort)
- Sofitel Legend Metropole Hanoi (Historic 100+ year old hotel)
- Anan Saigon (Real Michelin-star restaurant)
- Bún Chả Hương Liên (Obama's famous restaurant)
- Bà Nà Hills, Hội An, Hạ Long Bay (UNESCO sites)

❌ **Not Generic:** We avoided fake names like "Hotel ABC", "Restaurant 123"

---

#### 2. Realistic 2025 Pricing
✅ **Market-Accurate Prices:**
- InterCon Deluxe Room: 8,500,000 VND/night (actual 2025 rate)
- Anan Saigon VIP table deposit: 500,000 VND (real policy)
- Bà Nà cable car: 900,000 VND (current ticket price)

❌ **Not Generic:** We didn't use round numbers like "1000 VND" for hotel rooms

---

#### 3. Diverse User Scenarios
✅ **Realistic User Behaviors:**
- David Teo (Singapore tourist): Books luxury honeymoon suite → writes review
- Sophie Martin (French): Books historic hotel, long stay → multiple reviews
- Trần Thiên Lộc (Local): Budget bookings → earns Silver status
- Peter Cường Franklin: Real owner of Anan Saigon restaurant

❌ **Not Generic:** Users have realistic nationalities, booking patterns, spending levels

---

#### 4. Meaningful Business Logic
✅ **Real Constraints:**
- Voucher "Giảm 30% cho người dùng mới" (limited to rank Bronze)
- Bà Nà shows only on Friday/Saturday nights
- Hotels require 18+ age verification
- Reviews only from completed bookings

❌ **Not Generic:** Business rules match real-world tourism regulations

---

#### 5. Preference System Like Pinterest
✅ **Tag-Based Discovery:**
- Preferences: "Biển" (Beach), "Núi" (Mountain), "Sang trọng" (Luxury), "Ẩm thực" (Cuisine)
- Locations tagged with multiple preferences
- Tourists start with 3-5 preferences
- System auto-adds new preferences based on booking history (30-day refresh)

**How It Works (Like Pinterest):**
1. Tourist selects initial interests: ["Biển", "Ẩm thực", "Cặp đôi"]
2. Books InterCon (tagged: "Biển", "Sang trọng", "Thư giãn")
3. After 30 days, system checks most-booked preferences
4. Auto-adds "Sang trọng" if booking luxury hotels frequently
5. Recommendation engine suggests similar locations

---

### Sample Data Statistics
| Category | Count | Notes |
|----------|-------|-------|
| Total Locations | 30 | Hotels (10), Restaurants (10), Venues (10) |
| Active Users | 35 | Admins (5), Owners (10), Tourists (20) |
| International Tourists | 8 | Singapore, France, USA, Japan, Korea, Germany, Spain |
| Completed Reservations | 18 | Realistic conversion rate (~60%) |
| Reviews | 75 | 3 reviews per location (verified purchases only) |
| Vouchers | 15 | Active (6), Expired (2), Sold Out (2), Upcoming (1) |
| Preferences (Tags) | 30 | Covering location types, amenities, audience |
| Images | 35 | Avatars, location heroes, review photos |

---

## Conclusion

This SQL system demonstrates:
1. ✅ **Complete LOCATION CRUD** with validation and specific error messages
2. ✅ **Functions using CURSOR, LOOP, IF, QUERY patterns** (BTL 2.4)
3. ✅ **Procedures with GROUP BY, HAVING, ORDER BY** (BTL 2.3)
4. ✅ **Triggers for automation** (likeCount, ratings, spending, permissions)
5. ✅ **CHECK constraints where possible** (not wasting triggers)
6. ✅ **Meaningful sample data** (real Vietnamese tourism scenarios)
7. ✅ **Preference auto-update system** (Pinterest-style smart recommendations)

All procedures include **specific error messages** (not generic "Lỗi nhập dữ liệu!") and **comprehensive validation** before data modification.
