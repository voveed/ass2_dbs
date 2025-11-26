USE VIVUVIET;

SET FOREIGN_KEY_CHECKS=0; -- Tắt kiểm tra khóa ngoại để chèn dữ liệu

/* ================================================================
 BẢNG LEVEL 0 (CORE ENTITIES)
================================================================
*/

TRUNCATE TABLE USER_PHONE;
INSERT INTO USER_PHONE (userID, phoneNumber) VALUES
(1, '0909123456'), (1, '0909111222'), -- Admin 1 có 2 số
(2, '0912345670'), -- NHẬT MINH NÈ VY
(3, '0922333444'), -- Owner 1
(4, '0933444555'), -- Owner 2
(5, '0944555666'), -- Owner 3
(6, '0912345678'), -- Sun Group
(7, '0988777666'), -- Vingroup
(16, '0903333444'), -- Tourist Lộc
(17, '0905555666'), -- Tourist Thông
(18, '0907777888'), -- Tourist Vy
(19, '0909999000'), -- Tourist Bích Phương
(20, '0911222333'); -- Tourist Minh Tuấn


-- 1. IMAGE (35 Dòng)
TRUNCATE TABLE IMAGE;
INSERT INTO IMAGE (imageID, URL, `caption`, imageType) VALUES
(1, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d', 'Avatar Admin 1', 'AVATAR'),
(2, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791', 'Avatar Admin 2', 'AVATAR'),
(3, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', 'Avatar Owner 1', 'AVATAR'),
(4, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', 'Avatar Owner 2', 'AVATAR'),
(5, 'https://images.unsplash.com/photo-1566073771259-6a8506099945', 'Avatar Owner 3', 'AVATAR'),
(6, 'https://images.unsplash.com/photo-1582719508461-905c673771fd', 'Avatar Tourist 1', 'AVATAR'),
(7, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', 'Avatar Tourist 2', 'AVATAR'),
(8, 'https://images.unsplash.com/photo-1540541338287-41700207dee6', 'Avatar Tourist 3', 'AVATAR'),
(9, 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c', 'Avatar Tourist 4', 'AVATAR'),
(10, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a', 'Avatar Tourist 5', 'AVATAR'),
(11, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9', 'InterContinental Danang Sun Peninsula', 'LOCATION_HERO'),
(12, 'https://images.unsplash.com/photo-1549294413-26f195200c16', 'Sofitel Legend Metropole Hanoi', 'LOCATION_HERO'),
(13, 'https://images.unsplash.com/photo-1568495248636-6432b97bd949', 'Vinpearl Resort & Spa Nha Trang Bay', 'LOCATION_HERO'),
(14, 'https://images.unsplash.com/photo-1561501900-3701fa6a0864', 'Topas Ecolodge Sapa', 'LOCATION_HERO'),
(15, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6', 'The Reverie Saigon', 'LOCATION_HERO'), 
(16, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'Anan Saigon Restaurant', 'LOCATION_HERO'),
(17, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0', 'Quán Ăn Ngon 138', 'LOCATION_HERO'),
(18, 'https://images.unsplash.com/photo-1552566626-52f8b828add9', 'Bún Chả Hương Liên (Obama)', 'LOCATION_HERO'),
(19, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5', 'Pizza 4P''s Ben Thanh', 'LOCATION_HERO'),
(20, 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759', 'Morning Glory Original Hoi An', 'LOCATION_HERO'),
(21, 'https://images.unsplash.com/photo-1587502537815-0c8b5c9ba18c', 'Sun World Ba Na Hills', 'LOCATION_HERO'),
(22, 'https://images.unsplash.com/photo-1528127269322-539801943592', 'Phố Cổ Hội An', 'LOCATION_HERO'),
(23, 'https://images.unsplash.com/photo-1516406742598-6ecd2723c310', 'Vịnh Hạ Long', 'LOCATION_HERO'),
(24, 'https://images.unsplash.com/photo-1518002624146-59c53c43e063', 'Bảo tàng Chứng tích Chiến tranh', 'LOCATION_HERO'),
(25, 'https://images.unsplash.com/photo-1565538813622-d51e7a48d4f9', 'Địa đạo Củ Chi', 'LOCATION_HERO'),
(26, 'https://images.unsplash.com/photo-1611892440504-4010f30b23b3', 'Ảnh phòng Deluxe Ocean View', 'PRODUCT_PHOTO'),
(27, 'https://images.unsplash.com/photo-1590490359854-dfba19688f7b', 'Ảnh phòng Suite Tổng Thống', 'PRODUCT_PHOTO'),
(28, 'https://images.unsplash.com/photo-1554118811-1e0d58224f24', 'Ảnh bàn 2 người view sông', 'PRODUCT_PHOTO'),
(29, 'https://images.unsplash.com/photo-1505275350444-8362bb5b0853', 'Ảnh vé cáp treo Bà Nà', 'PRODUCT_PHOTO'),
(30, 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7', 'Ảnh review của khách 1', 'REVIEW_PHOTO'),
(31, 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7', 'Ảnh review của khách 2', 'REVIEW_PHOTO'),
(32, 'https://images.unsplash.com/photo-1583396450987-ff5e02d85157', 'Ảnh review của khách 3', 'REVIEW_PHOTO'),
(33, 'https://img.icons8.com/plasticine/100/swimming-pool.png', 'Icon Hồ bơi', 'UTILITY_ICON'),
(34, 'https://img.icons8.com/plasticine/100/wifi.png', 'Icon WiFi', 'UTILITY_ICON'),
(35, 'https://img.icons8.com/plasticine/100/spa.png', 'Icon Spa', 'UTILITY_ICON');

-- 2. PREFERENCE (30 Dòng)
TRUNCATE TABLE PREFERENCE;
INSERT INTO PREFERENCE (prefID, prefName, category, prefDescription) VALUES
(1, 'Biển', 'Địa điểm', 'Các hoạt động liên quan đến biển, bãi tắm, nghỉ dưỡng ven biển.'),
(2, 'Núi', 'Địa điểm', 'Các hoạt động leo núi, không khí trong lành, trekking, ngắm cảnh núi non.'),
(3, 'Sang trọng', 'Phong cách', 'Dịch vụ 5-6 sao, cao cấp, xa xỉ, nội thất lộng lẫy.'),
(4, 'Bình dân', 'Phong cách', 'Giá cả phải chăng, tiết kiệm, phù hợp với du lịch bụi.'),
(5, 'Gia đình', 'Đối tượng', 'Phù hợp cho trẻ em và người lớn tuổi, có khu vui chơi, an toàn.'),
(6, 'Cặp đôi', 'Đối tượng', 'Không gian lãng mạn, riêng tư, yên tĩnh, có dịch vụ cho cặp đôi.'),
(7, 'Một mình', 'Đối tượng', 'An toàn và phù hợp cho du lịch một mình, dễ kết bạn.'),
(8, 'Ẩm thực', 'Sở thích', 'Khám phá món ăn địa phương, nhà hàng ngon, tour ẩm thực.'),
(9, 'Phiêu lưu', 'Sở thích', 'Các hoạt động mạo hiểm, khám phá: lặn biển, nhảy dù, trekking.'),
(10, 'Thư giãn', 'Sở thích', 'Spa, yoga, nghỉ dưỡng, yên tĩnh, không ồn ào.'),
(11, 'Văn hóa', 'Sở thích', 'Tìm hiểu văn hóa địa phương, lễ hội, làng nghề truyền thống.'),
(12, 'Lịch sử', 'Sở thích', 'Các địa điểm di tích lịch sử, bảo tàng, chiến tranh.'),
(13, 'Mua sắm', 'Sở thích', 'Chợ địa phương, trung tâm thương mại, cửa hàng đặc sản.'),
(14, 'Cuộc sống về đêm', 'Sở thích', 'Bar, club, pub, chợ đêm, các hoạt động giải trí ban đêm.'),
(15, 'Thiên nhiên', 'Địa điểm', 'Gần gũi với thiên nhiên, vườn quốc gia, sông hồ, hang động.'),
(16, 'Homestay', 'Loại hình', 'Ở nhà dân, trải nghiệm cuộc sống địa phương đích thực.'),
(17, 'Resort', 'Loại hình', 'Khu nghỉ dưỡng phức hợp với đầy đủ tiện nghi, biệt lập.'),
(18, 'Check-in', 'Sở thích', 'Địa điểm có nhiều góc chụp ảnh đẹp, độc đáo, nổi tiếng.'),
(19, 'Yên tĩnh', 'Không khí', 'Nơi vắng vẻ, ít ồn ào, phù hợp để nghỉ ngơi tuyệt đối.'),
(20, 'Sôi động', 'Không khí', 'Nơi đông đúc, náo nhiệt, nhiều hoạt động.'),
(21, 'Kiến trúc', 'Sở thích', 'Công trình có kiến trúc độc đáo, cổ điển hoặc hiện đại.'),
(22, 'Nghệ thuật', 'Sở thích', 'Bảo tàng nghệ thuật, gallery, các buổi biểu diễn, show diễn.'),
(23, 'Du lịch sinh thái', 'Loại hình', 'Du lịch bền vững, bảo vệ môi trường, khám phá hệ sinh thái.'),
(24, 'Bể bơi vô cực', 'Tiện nghi', 'Khách sạn hoặc resort có bể bơi vô cực view đẹp.'),
(25, 'View đẹp', 'Tiện nghi', 'Phòng hoặc nhà hàng có tầm nhìn đẹp (biển, núi, thành phố).'),
(26, 'Ẩm thực đường phố', 'Ẩm thực', 'Các món ăn lề đường, chợ đêm, gánh hàng rong.'),
(27, 'Món chay', 'Ẩm thực', 'Nhà hàng chuyên phục vụ đồ chay hoặc có nhiều lựa chọn chay.'),
(28, 'Hải sản', 'Ẩm thực', 'Nhà hàng chuyên hải sản tươi sống, ven biển.'),
(29, 'Golf', 'Thể thao', 'Gần sân golf hoặc có sân golf trong khuôn viên.'),
(30, 'Lặn biển', 'Thể thao', 'Khu vực có dịch vụ lặn biển ngắm san hô (Scuba diving/Snorkeling).');

-- 3. UTILITY (30 Dòng)
TRUNCATE TABLE UTILITY;
INSERT INTO UTILITY (utility, uName, uType, UDescription) VALUES
(1, 'WiFi miễn phí', 'Cơ bản', 'WiFi tốc độ cao miễn phí trong phòng và khu vực chung.'),
(2, 'Hồ bơi', 'Giải trí', 'Hồ bơi ngoài trời cho người lớn và trẻ em.'),
(3, 'Bãi đỗ xe miễn phí', 'Cơ bản', 'Bãi đỗ xe an toàn, miễn phí cho khách lưu trú.'),
(4, 'Nhà hàng trong khuôn viên', 'Ăn uống', 'Phục vụ các bữa ăn trong ngày, đặc sản địa phương.'),
(5, 'Quầy bar', 'Giải trí', 'Quầy bar/lounge phục vụ cocktail, rượu và đồ uống nhẹ.'),
(6, 'Dịch vụ phòng 24/7', 'Cơ bản', 'Phục vụ ăn uống và các yêu cầu khác tại phòng 24/24.'),
(7, 'Phòng gym', 'Sức khỏe', 'Phòng tập thể dục với các thiết bị tim mạch và tạ hiện đại.'),
(8, 'Spa & Wellness', 'Sức khỏe', 'Dịch vụ massage, xông hơi, jacuzzi, trị liệu chăm sóc sức khỏe.'),
(9, 'Đưa đón sân bay', 'Dịch vụ', 'Dịch vụ xe đưa đón 2 chiều từ sân bay (có phí hoặc miễn phí).'),
(10, 'Bãi biển riêng', 'Giải trí', 'Khu vực bãi biển riêng tư, sạch sẽ, có ghế tắm nắng.'),
(11, 'Phòng họp / Hội nghị', 'Công tác', 'Phòng họp được trang bị âm thanh, máy chiếu cho sự kiện, hội thảo.'),
(12, 'Thân thiện với thú cưng', 'Dịch vụ', 'Cho phép khách mang theo thú cưng (có điều kiện).'),
(13, 'Khu vui chơi trẻ em', 'Giải trí', 'Câu lạc bộ trẻ em (Kids Club) với các hoạt động trong nhà và ngoài trời.'),
(14, 'Lễ tân 24/7', 'Cơ bản', 'Lễ tân trực 24 giờ, hỗ trợ check-in, check-out và thông tin du lịch.'),
(15, 'View biển', 'Tiện nghi phòng', 'Phòng có tầm nhìn trực diện hoặc một phần ra biển.'),
(16, 'Bồn tắm', 'Tiện nghi phòng', 'Phòng tắm có bồn tắm nằm thư giãn.'),
(17, 'Điều hòa nhiệt độ', 'Cơ bản', 'Tất cả các phòng và khu vực chung đều có điều hòa.'),
(18, 'Smart TV', 'Tiện nghi phòng', 'TV thông minh có kết nối internet, Netflix, Youtube.'),
(19, 'An ninh 24/7', 'Cơ bản', 'Bảo vệ và hệ thống camera an ninh 24/7.'),
(20, 'Chấp nhận thẻ tín dụng', 'Cơ bản', 'Thanh toán bằng các loại thẻ Visa, Mastercard, AMEX.'),
(21, 'Lớp học nấu ăn', 'Giải trí', 'Lớp học nấu các món ăn địa phương cho du khách.'),
(22, 'Bữa sáng miễn phí', 'Ăn uống', 'Bao gồm bữa sáng buffet hoặc à la carte miễn phí.'),
(23, 'Bể bơi nước nóng', 'Sức khỏe', 'Hồ bơi có hệ thống làm nóng nước, phù hợp với thời tiết lạnh.'),
(24, 'Sân Tennis', 'Thể thao', 'Sân tennis tại chỗ cho khách sử dụng.'),
(25, 'Dịch vụ giặt ủi', 'Dịch vụ', 'Dịch vụ giặt ủi, sấy khô trong ngày.'),
(26, 'Cho thuê xe đạp', 'Dịch vụ', 'Cho thuê xe đạp miễn phí hoặc có phí để khám phá xung quanh.'),
(27, 'Nhận phòng/Trả phòng nhanh', 'Dịch vụ', 'Quy trình check-in/check-out nhanh chóng, linh hoạt.'),
(28, 'Tiện nghi cho người khuyết tật', 'Cơ bản', 'Lối đi, phòng và thang máy cho xe lăn.'),
(29, 'Karaoke', 'Giải trí', 'Phòng karaoke riêng tư cho nhóm, gia đình.'),
(30, 'Sân golf mini', 'Thể thao', 'Sân golf mini giải trí trong khuôn viên.');

-- 4. PRODUCT (35 Dòng)
TRUNCATE TABLE PRODUCT;
INSERT INTO PRODUCT (productID, productName, category, pricingUnit, description, basePrice) VALUES
(1, 'Phòng Deluxe Hướng Biển', 'ROOMTYPE', '/đêm', 'Phòng 40m2 hướng biển, ban công riêng, 2 người lớn.', 8500000),
(2, 'Phòng Classic Heritage Wing', 'ROOMTYPE', '/đêm', 'Phòng 32m2 ở khu lịch sử, nội thất cổ điển, 2 người lớn.', 12000000),
(3, 'Phòng Deluxe Hướng Vườn', 'ROOMTYPE', '/đêm', 'Phòng 35m2 hướng vườn nhiệt đới, 2 người lớn, 1 trẻ em.', 4500000),
(4, 'Premium Valley Bungalow', 'ROOMTYPE', '/đêm', 'Bungalow 50m2 riêng biệt, view thung lũng Mường Hoa.', 7000000),
(5, 'Phòng Grand Deluxe City View', 'ROOMTYPE', '/đêm', 'Phòng 50m2 view toàn cảnh thành phố, nội thất Ý.', 10000000),
(6, 'Phòng Suite Tổng Thống', 'ROOMTYPE', '/đêm', 'Phòng hạng tổng thống 200m2, quản gia riêng, hồ bơi riêng.', 150000000),
(7, 'Phòng Standard Hướng Phố', 'ROOMTYPE', '/đêm', 'Phòng tiêu chuẩn 25m2, 2 người, không view.', 3000000),
(8, 'Bungalow Trên Mặt Nước', 'ROOMTYPE', '/đêm', 'Bungalow 60m2 trên mặt biển, sàn kính, 2 người.', 15000000),
(9, 'Phòng Gia Đình (2 Giường Lớn)', 'ROOMTYPE', '/đêm', 'Phòng 55m2, 2 giường Queen, cho 4 người.', 6000000),
(10, 'Phòng Dorm 8 Giường (Nữ)', 'ROOMTYPE', '/giường', '1 giường trong phòng tập thể 8 người, chỉ dành cho nữ.', 350000),
(11, 'Bàn 2 người (Standard)', 'TABLE_TYPE', '/bàn', 'Bàn tiêu chuẩn dành cho 2 thực khách.', 0),
(12, 'Bàn 4 người (Standard)', 'TABLE_TYPE', '/bàn', 'Bàn tiêu chuẩn dành cho 4 thực khách.', 0),
(13, 'Bàn 2 người (View bếp mở)', 'TABLE_TYPE', '/bàn', 'Bàn 2 người tại quầy bar nhìn trực diện bếp mở.', 100000),
(14, 'Bàn 6 người (Ngoài trời)', 'TABLE_TYPE', '/bàn', 'Bàn 6 người khu vực sân vườn/ngoài trời.', 0),
(15, 'Bàn 2 người (Cạnh cửa sổ)', 'TABLE_TYPE', '/bàn', 'Bàn 2 người lãng mạn cạnh cửa sổ view đẹp.', 50000),
(16, 'Bàn VIP 10 người (Phòng riêng)', 'TABLE_TYPE', '/bàn', 'Bàn tiệc 10 người tại phòng VIP, yêu cầu đặt cọc.', 500000),
(17, 'Bàn 1 người (Quầy bar)', 'TABLE_TYPE', '/bàn', 'Ghế lẻ tại quầy bar.', 0),
(18, 'Bàn 8 người (Gia đình)', 'TABLE_TYPE', '/bàn', 'Bàn tròn 8 người phù hợp cho gia đình.', 0),
(19, 'Bàn 2 người (View Sông)', 'TABLE_TYPE', '/bàn', 'Bàn 2 người sát bờ sông Sài Gòn.', 150000),
(20, 'Bàn 4 người (Trong nhà)', 'TABLE_TYPE', '/bàn', 'Bàn 4 người khu vực máy lạnh.', 0),
(21, 'Vé cáp treo Bà Nà (Người lớn)', 'TICKET_TYPE', '/vé', 'Vé vào cổng và cáp treo khứ hồi cho 1 người lớn (cao > 1m4).', 900000),
(22, 'Vé cáp treo Bà Nà (Trẻ em)', 'TICKET_TYPE', '/vé', 'Vé vào cổng và cáp treo khứ hồi cho 1 trẻ em (1m-1m4).', 750000),
(23, 'Vé tham quan Phố cổ Hội An', 'TICKET_TYPE', '/vé', 'Vé tham quan 5 điểm di tích trong phố cổ (nhà cổ, chùa...).', 120000),
(24, 'Vé tàu Vịnh Hạ Long (Tuyến 2)', 'TICKET_TYPE', '/vé', 'Vé tàu tham quan Vịnh Hạ Long tuyến 2 (4 tiếng, hang Sửng Sốt, Titop).', 290000),
(25, 'Vé tham quan Bảo tàng CTCT', 'TICKET_TYPE', '/vé', 'Vé vào cổng Bảo tàng Chứng tích Chiến tranh.', 40000),
(26, 'Vé tham quan Địa đạo Củ Chi', 'TICKET_TYPE', '/vé', 'Vé vào cổng khu di tích Bến Dược hoặc Bến Đình.', 70000),
(27, 'Vé buffet trưa (Người lớn)', 'TICKET_TYPE', '/vé', 'Vé buffet trưa tại nhà hàng Arapang (Bà Nà Hills).', 350000),
(28, 'Vé xem show Ký Ức Hội An', 'TICKET_TYPE', '/vé', 'Vé xem show diễn thực cảnh Ký Ức Hội An (Hạng Eco).', 600000),
(29, 'Vé VinWonders Nha Trang (Người lớn)', 'TICKET_TYPE', '/vé', 'Vé vui chơi không giới hạn tại VinWonders Nha Trang.', 880000),
(30, 'Vé Hoàng Cung Huế', 'TICKET_TYPE', '/vé', 'Vé tham quan Đại Nội - Hoàng Cung Huế.', 200000),
(31, 'Phòng Superior Double', 'ROOMTYPE', '/đêm', 'Phòng 30m2, 1 giường đôi, 2 người.', 1500000),
(32, 'Phòng Deluxe Twin', 'ROOMTYPE', '/đêm', 'Phòng 35m2, 2 giường đơn, 2 người.', 1800000),
(33, 'Bàn 10 người (Sảnh chính)', 'TABLE_TYPE', '/bàn', 'Bàn 10 người tại sảnh chính.', 0),
(34, 'Vé tham quan Dinh Độc Lập', 'TICKET_TYPE', '/vé', 'Vé vào cổng Dinh Độc Lập (Hội trường Thống Nhất).', 65000),
(35, 'Vé xem Rối Nước Thăng Long', 'TICKET_TYPE', '/vé', 'Vé xem show múa rối nước tại Hà Nội (Hạng 1).', 200000);

-- 5. VOUCHER (15 Dòng)
-- Adjusted dates to be valid for November 2025 testing
TRUNCATE TABLE VOUCHER;
INSERT INTO VOUCHER (voucherID, rankRequirement, limitVal, discountPercentage, slots, used_slots, voucherDescription, startDate, expDate) VALUES
(1, 0, 500000, 0.1, 1000, 50, 'Giảm 10% cho đơn từ 500k', '2025-10-01', '2025-12-31'),
(2, 0, 0, 0.2, 5000, 1200, 'Chào mừng năm 2025, giảm 20%', '2025-01-01', '2025-12-31'),  -- Extended to Dec 2025
(3, 2, 2000000, 0.15, 100, 5, 'Ưu đãi hạng Vàng, giảm 15% cho đơn từ 2M', '2025-01-01', '2025-12-31'),
(4, 3, 5000000, 0.2, 50, 1, 'Ưu đãi hạng Bạch Kim, giảm 20% cho đơn từ 5M', '2025-01-01', '2025-12-31'),
(5, 0, 1000000, 0.1, 200, 0, 'Khám phá Đà Nẵng, giảm 10%', '2025-11-01', '2025-11-30'),
(6, 0, 300000, 0.15, 500, 150, 'Giảm 15% khi đặt nhà hàng từ 300k', '2025-11-01', '2025-11-30'),
(7, 0, 1500000, 0.5, 10, 0, 'Flash Sale 12.12, giảm 50%', '2025-12-12', '2025-12-13'),  -- Upcoming
(8, 0, 100000, 0.1, 100, 10, 'Voucher đã hết hạn (test)', '2024-01-01', '2024-01-31'),  -- Intentionally expired for testing
(9, 0, 100000, 0.1, 100, 100, 'Voucher đã hết lượt (test)', '2025-11-01', '2025-12-31'),  -- Intentionally sold out for testing
(10, 1, 1000000, 0.05, 300, 25, 'Giảm 5% cho đơn từ 1M (Hạng Bạc)', '2025-11-01', '2025-12-15'),
(11, 1, 1500000, 0.1, 200, 15, 'Ưu đãi hạng Bạc, giảm 10% cho đơn từ 1.5M', '2025-01-01', '2025-12-31'),
(12, 0, 2000000, 0.08, 500, 0, 'Giảm 8% khi đặt khách sạn từ 2M', '2025-11-10', '2025-12-31'),  -- Extended to Dec 31
(13, 0, 500000, 0.1, 1000, 50, 'Giảm 10% khi mua vé tham quan từ 500k', '2025-11-10', '2025-12-31'),  -- Extended to Dec 31
(14, 0, 0, 0.3, 10000, 2000, 'Giảm 30% cho người dùng mới', '2025-01-01', '2025-12-31'),
(15, 1, 500000, 0.15, 500, 0, 'Giảm 15% cho khách hàng quay lại', '2025-11-01', '2025-12-15');


-- 6. USER_ACCOUNT (35 Dòng)
-- (ĐÃ LOẠI BỎ 'status')
TRUNCATE TABLE USER_ACCOUNT;
INSERT INTO USER_ACCOUNT (userID, mail, fullName, city, district, password, DOB, role) VALUES
-- Admins (5)
(1, 'admin@vivuviet.com', 'Dương Huỳnh Anh Đức', 'TP. Hồ Chí Minh', 'Quận 1', '$2b$10$..hashed_password..', '1990-01-01', 'ADMIN'),
(2, 'manager@vivuviet.com', 'Vũ Nhật Minh', 'Hà Nội', 'Ba Đình', '$2b$10$..hashed_password..', '1992-05-10', 'ADMIN'),
(3, 'support@vivuviet.com', 'Lý Thu Thảo', 'Đà Nẵng', 'Hải Châu', '$2b$10$..hashed_password..', '1998-11-20', 'ADMIN'),
(4, 'it.admin@vivuviet.com', 'Phạm Hoàng Long', 'TP. Hồ Chí Minh', 'Quận 7', '$2b$10$..hashed_password..', '1995-02-18', 'ADMIN'),
(5, 'deactivated.admin@vivuviet.com', 'Ngô Văn Bảo', 'Hà Nội', 'Tây Hồ', '$2b$10$..hashed_password..', '1991-09-09', 'ADMIN'),
-- Business Owners (10)
(6, 'sungroup@gmail.com', 'Tập đoàn Sun Group', 'Đà Nẵng', 'Hải Châu', '$2b$10$..hashed_password..', '1980-03-15', 'OWNER'),
(7, 'vingroup@gmail.com', 'Tập đoàn Vingroup', 'Hà Nội', 'Long Biên', '$2b$10$..hashed_password..', '1975-08-20', 'OWNER'),
(8, 'metropole@gmail.com', 'Sofitel Metropole', 'Hà Nội', 'Hoàn Kiếm', '$2b$10$..hashed_password..', '1985-11-05', 'OWNER'),
(9, 'anansaigon@gmail.com', 'Peter Cường Franklin', 'TP. Hồ Chí Minh', 'Quận 1', '$2b$10$..hashed_password..', '1988-07-07', 'OWNER'),
(10, 'ms.vy@gmail.com', 'Trịnh Thị Vy', 'Quảng Nam', 'Hội An', '$2b$10$..hashed_password..', '1970-02-28', 'OWNER'),
(11, 'pizza4ps@gmail.com', 'Tập đoàn Pizza 4P''s', 'TP. Hồ Chí Minh', 'Quận 3', '$2b$10$..hashed_password..', '1990-04-10', 'OWNER'),
(12, 'topas.eco@gmail.com', 'Topas Ecolodge', 'Lào Cai', 'Sa Pa', '$2b$10$..hashed_password..', '1982-06-15', 'OWNER'),
(13, 'war.museum@gov.vn', 'Bảo tàng Chứng tích CT', 'TP. Hồ Chí Minh', 'Quận 3', '$2b$10$..hashed_password..', '1975-09-04', 'OWNER'),
(14, 'cuchi.tunnels@gov.vn', 'Khu di tích Củ Chi', 'TP. Hồ Chí Minh', 'Củ Chi', '$2b$10$..hashed_password..', '1976-01-01', 'OWNER'),
(15, 'pending.owner@gmail.com', 'Khách sạn Hoa Hồng', 'Đà Lạt', 'Phường 4', '$2b$10$..hashed_password..', '1999-03-03', 'OWNER'),
-- Tourists (20)
(16, 'thienloc@gmail.com', 'Trần Thiên Lộc', 'TP. Hồ Chí Minh', 'Gò Vấp', '$2b$10$..hashed_password..', '2003-01-10', 'TOURIST'),
(17, 'nhatthong@gmail.com', 'Trần Nguyễn Nhất Thông', 'TP. Hồ Chí Minh', 'Tân Bình', '$2b$10$..hashed_password..', '2003-02-15', 'TOURIST'),
(18, 'doanvy@gmail.com', 'Đinh Đoàn Vy', 'TP. Hồ Chí Minh', 'Quận 10', '$2b$10$..hashed_password..', '2003-03-20', 'TOURIST'),
(19, 'bichphuong@gmail.com', 'Nguyễn Thị Bích Phương', 'Đà Nẵng', 'Thanh Khê', '$2b$10$..hashed_password..', '1999-10-25', 'TOURIST'),
(20, 'minhtuan@gmail.com', 'Lê Minh Tuấn', 'Hà Nội', 'Cầu Giấy', '$2b$10$..hashed_password..', '1995-06-30', 'TOURIST'),
(21, 'hoaanhdao@gmail.com', 'Trần Hoa Anh Đào', 'Lâm Đồng', 'Đà Lạt', '$2b$10$..hashed_password..', '2000-04-12', 'TOURIST'),
(22, 'davidteo@gmail.com', 'David Teo', 'Singapore', 'Singapore', '$2b$10$..hashed_password..', '1998-12-01', 'TOURIST'),
(23, 'sophie@gmail.com', 'Sophie Martin', 'France', 'Paris', '$2b$10$..hashed_password..', '1993-09-05', 'TOURIST'),
(24, 'tranquang@gmail.com', 'Trần Văn Quảng', 'Hải Phòng', 'Lê Chân', '$2b$10$..hashed_password..', '2002-08-18', 'TOURIST'),
(25, 'maianh@gmail.com', 'Đặng Mai Anh', 'Cần Thơ', 'Ninh Kiều', '$2b$10$..hashed_password..', '2004-07-22', 'TOURIST'),
(26, 'john.doe@gmail.com', 'John Doe', 'USA', 'New York', '$2b$10$..hashed_password..', '1990-01-01', 'TOURIST'),
(27, 'kenji@gmail.com', 'Kenji Tanaka', 'Japan', 'Tokyo', '$2b$10$..hashed_password..', '1988-05-15', 'TOURIST'),
(28, 'minjun@gmail.com', 'Park Min-jun', 'Korea', 'Seoul', '$2b$10$..hashed_password..', '2001-11-30', 'TOURIST'),
(29, 'anhtuan@gmail.com', 'Nguyễn Anh Tuấn', 'Hà Nội', 'Đống Đa', '$2b$10$..hashed_password..', '1985-04-11', 'TOURIST'),
(30, 'thuylinh@gmail.com', 'Hoàng Thùy Linh', 'Quảng Ninh', 'Hạ Long', '$2b$10$..hashed_password..', '1996-08-22', 'TOURIST'),
(31, 'peter@gmail.com', 'Peter Schmidt', 'Germany', 'Berlin', '$2b$10$..hashed_password..', '1992-07-14', 'TOURIST'),
(32, 'maria@gmail.com', 'Maria Garcia', 'Spain', 'Madrid', '$2b$10$..hashed_password..', '1997-03-05', 'TOURIST'),
(33, 'huyentrang@gmail.com', 'Nguyễn Huyền Trang', 'Ninh Bình', 'Hoa Lư', '$2b$10$..hashed_password..', '1998-10-10', 'TOURIST'),
(34, 'quocbao@gmail.com', 'Phan Quốc Bảo', 'Huế', 'Phú Xuân', '$2b$10$..hashed_password..', '2000-12-25', 'TOURIST'),
(35, 'deactivated.user@gmail.com', 'Tài Khoản Bị Khóa', 'TP. Hồ Chí Minh', 'Bình Thạnh', '$2b$10$..hashed_password..', '1999-01-01', 'TOURIST');

-- 7. ADMINISTRATOR (5 Dòng)
TRUNCATE TABLE ADMINISTRATOR;
INSERT INTO ADMINISTRATOR (adminID, jobName, permissionLevel) VALUES
(1, 'Database Administrator', 'FULL_CONTROL'),
(2, 'Content Manager', 'MODERATE_CONTENT'),
(3, 'Support Lead', 'SUPPORT_ACCESS'),
(4, 'System Architect', 'FULL_CONTROL'),
(5, 'Former Admin', 'NO_ACCESS');

-- 8. BUSINESS_OWNER (10 Dòng)
TRUNCATE TABLE BUSINESS_OWNER;
INSERT INTO BUSINESS_OWNER (BOID, taxCode, auStatus) VALUES
(6, '0100108888', 'VERIFIED'),
(7, '0100108999', 'VERIFIED'),
(8, '0100108777', 'VERIFIED'),
(9, '8392749102', 'VERIFIED'),
(10, '4001239876', 'VERIFIED'),
(11, '0312345678', 'VERIFIED'),
(12, '5300123456', 'VERIFIED'),
(13, '0300755335', 'VERIFIED'),
(14, '0300488612', 'VERIFIED'),
(15, '1234567890-PENDING', 'PENDING');

-- 9. TOURIST (20 Dòng)
-- Rank is DERIVED from totalSpent (auto-updated by trigger trg_after_tourist_spent_update_rank)
-- Rank thresholds: Bronze (<5M), Silver (5-10M), Gold (10-20M), Platinum (20-50M), Diamond (>=50M)
-- These values represent HISTORICAL spending - future completed transactions will trigger automatic rank updates
TRUNCATE TABLE TOURIST; -- ĐÃ SỬA DỮ LIỆU HẠNG THÀNH SỐ
INSERT INTO TOURIST (touristID, nationality, legalID, loyaltypoints, totalSpent, rankLevel, lastPreferenceUpdate) VALUES
(16, 'Việt Nam', '079203001111', 850, 7500000, 1, '2025-10-01'),      -- Silver -> 1
(17, 'Việt Nam', '079203002222', 1500, 12000000, 2, '2025-01-01'),     -- Gold -> 2
(18, 'Việt Nam', '079203003333', 2500, 25000000, 3, '2025-10-01'),     -- Platinum -> 3
(19, 'Việt Nam', '045199004444', 450, 4200000, 0, '2025-10-01'),       -- Bronze -> 0
(20, 'Việt Nam', '001195005555', 650, 6000000, 1, '2025-10-01'),       -- Silver -> 1
(21, 'Việt Nam', '068200006666', 200, 1800000, 0, '2025-10-01'),       -- Bronze -> 0
(22, 'Singapore', 'S1234567A', 3500, 35000000, 3, '2025-10-01'),       -- Platinum -> 3
(23, 'France', 'FR9876543B', 1200, 11000000, 2, '2025-10-01'),         -- Gold -> 2
(24, 'Việt Nam', '031202007777', 300, 2500000, 0, '2025-11-01'),       -- Bronze -> 0
(25, 'Việt Nam', '092204008888', 800, 7000000, 1, '2025-11-01'),       -- Silver -> 1
(26, 'USA', 'US123456789', 100, 500000, 0, '2025-10-01'),              -- Bronze -> 0
(27, 'Japan', 'JP987654321', 150, 800000, 0, '2025-10-01'),            -- Bronze -> 0
(28, 'Korea', 'KR881122-1', 120, 600000, 0, '2025-10-01'),             -- Bronze -> 0
(29, 'Việt Nam', '001085001234', 2000, 15000000, 2, '2025-10-01'),     -- Gold -> 2
(30, 'Việt Nam', '022196004321', 400, 3500000, 0, '2025-10-01'),       -- Bronze -> 0
(31, 'Germany', 'DE456789123', 0, 0, 0, '2025-11-01'),                 -- Bronze -> 0
(32, 'Spain', 'ES789123456', 0, 0, 0, '2025-11-01'),                   -- Bronze -> 0
(33, 'Việt Nam', '037198009876', 0, 0, 0, '2025-11-01'),               -- Bronze -> 0
(34, 'Việt Nam', '046200001122', 0, 0, 0, '2025-11-01'),               -- Bronze -> 0
(35, 'Việt Nam', '079199004455', 0, 0, 0, '2025-11-01');               -- Bronze -> 0


-- 10. ROOMTYPE (12 Dòng)
TRUNCATE TABLE ROOMTYPE;
INSERT INTO ROOMTYPE (roomTypeID, capacity) VALUES
(1, 2),
(2, 2),
(3, 3),
(4, 2),
(5, 2),
(6, 4),
(7, 2),
(8, 2),
(9, 4),
(10, 1),
(31, 2),
(32, 2);

-- 11. TABLE_TYPE (11 Dòng)
TRUNCATE TABLE TABLE_TYPE;
INSERT INTO TABLE_TYPE (tableTypeID, numOfCustomers, viewDescription) VALUES
(11, 2, 'Tiêu chuẩn, trong nhà'),
(12, 4, 'Tiêu chuẩn, trong nhà'),
(13, 2, 'View bếp mở (quầy bar)'),
(14, 6, 'Ngoài trời, sân vườn'),
(15, 2, 'Cạnh cửa sổ, lãng mạn'),
(16, 10, 'Phòng VIP, riêng tư'),
(17, 1, 'Quầy bar'),
(18, 8, 'Bàn tròn gia đình'),
(19, 2, 'View sông, ngoài trời'),
(20, 4, 'Trong nhà, máy lạnh'),
(33, 10, 'Sảnh chính, gần sân khấu');

-- 12. TICKET_TYPE (12 Dòng)
TRUNCATE TABLE TICKET_TYPE;
INSERT INTO TICKET_TYPE (ticketTypeID, validity, audienceType) VALUES
(21, 'Trong ngày', 'Người lớn'),
(22, 'Trong ngày', 'Trẻ em (1m-1m4)'),
(23, 'Trong ngày', 'Mọi đối tượng'),
(24, '1 Tuyến (4 tiếng)', 'Mọi đối tượng'),
(25, '1 lượt', 'Mọi đối tượng'),
(26, '1 lượt', 'Mọi đối tượng'),
(27, '1 bữa trưa', 'Người lớn'),
(28, '1 lượt xem', 'Mọi đối tượng'),
(29, 'Trong ngày', 'Người lớn (cao > 1m4)'),
(30, '1 lượt', 'Mọi đối tượng'),
(34, '1 lượt', 'Mọi đối tượng'),
(35, '1 lượt xem', 'Mọi đối tượng');

-- 13. USER_ACCOUNT_HAS_IMAGE (10 Dòng)
-- (Liên kết 1:1, userID là PK)
TRUNCATE TABLE USER_ACCOUNT_HAS_IMAGE;
INSERT INTO USER_ACCOUNT_HAS_IMAGE (userID, imageID) VALUES
(1, 1),
(3, 3),
(6, 4),
(7, 5),
(16, 6),
(17, 7),
(18, 8),
(19, 9),
(20, 10),
(22, 2); -- David Teo dùng ảnh Avatar 2

-- 14. PRODUCT_HAS_IMAGE (35 Dòng)
-- (Liên kết M-N)
TRUNCATE TABLE PRODUCT_HAS_IMAGE;
INSERT INTO PRODUCT_HAS_IMAGE (productID, imageID) VALUES
(1, 26), (1, 11), -- Phòng Deluxe (ảnh riêng, ảnh chung của location)
(2, 27), (2, 12),
(3, 26), (3, 13),
(4, 26), (4, 14),
(5, 27), (5, 15),
(6, 27),
(7, 26),
(8, 27),
(9, 26),
(11, 28), (11, 17),
(12, 28), (12, 17),
(13, 28), (13, 16),
(14, 28), (14, 17),
(15, 28), (15, 19),
(16, 28), (16, 16),
(19, 28),
(21, 29), (21, 21),
(22, 29), (22, 21),
(23, 29), (23, 22),
(24, 29), (24, 23),
(25, 29), (25, 24),
(26, 29), (26, 25),
(27, 29), (27, 21),
(28, 29), (28, 22),
(29, 29), (29, 13),
(30, 29),
(34, 29),
(35, 29);

-- 15. UTILITY_HAS_IMAGE (15 Dòng logic)
TRUNCATE TABLE UTILITY_HAS_IMAGE;
INSERT INTO UTILITY_HAS_IMAGE (utility, imageID) VALUES
-- Tiện ích 'Hồ bơi' (ID 2) -> Link đến ảnh Location có hồ bơi
(2, 11), -- Ảnh InterContinental Danang (có hồ bơi)
(2, 13), -- Ảnh Vinpearl Nha Trang (có hồ bơi)
(2, 15), -- Ảnh The Reverie Saigon (có hồ bơi)

-- Tiện ích 'Nhà hàng trong khuôn viên' (ID 4) -> Link đến ảnh Nhà hàng
(4, 16), -- Ảnh Anan Saigon
(4, 17), -- Ảnh Quán Ăn Ngon
(4, 18), -- Ảnh Bún Chả Hương Liên
(4, 19), -- Ảnh Pizza 4P's
(4, 20), -- Ảnh Morning Glory

-- Tiện ích 'Quầy bar' (ID 5) -> Link đến ảnh nhà hàng/bar
(5, 16), -- Ảnh Anan Saigon (có quầy bar)
(5, 19), -- Ảnh Pizza 4P's (có quầy bar)

-- Tiện ích 'Bãi biển riêng' (ID 10) -> Link đến ảnh resort có bãi biển
(10, 11), -- Ảnh InterContinental Danang
(10, 13), -- Ảnh Vinpearl Nha Trang

-- Tiện ích 'View biển' (ID 15)
(15, 11), -- Ảnh InterContinental Danang

-- Tiện ích 'Bồn tắm' (ID 16)
(16, 26), -- Ảnh phòng Deluxe (có thể có bồn tắm)
(16, 27); -- Ảnh phòng Suite (chắc chắn có bồn tắm)
SET FOREIGN_KEY_CHECKS=1; -- Bật lại kiểm tra khóa ngoại

USE VIVUVIET;

SET FOREIGN_KEY_CHECKS=0; -- Tắt kiểm tra khóa ngoại để chèn dữ liệu

/* ================================================================
 BẢNG LEVEL 2 (CORE BUSINESS ENTITIES)
================================================================
*/

-- 16. LOCATION (30 Dòng)
-- (SỬA LỖI CÁC DÒNG locID 21-30)
TRUNCATE TABLE LOCATION;
INSERT INTO LOCATION (locID, locName, locNo, street, ward, district, province, priceLev, status, description, locType, ownerID) VALUES
-- HOTELS (10)
(1, 'InterContinental Danang Sun Peninsula', 'Bãi Bắc', 'Bán đảo Sơn Trà', 'Thọ Quang', 'Sơn Trà', 'Đà Nẵng', 'LUXURY', 'ACTIVE', 'Resort 5 sao sang trọng bậc nhất với kiến trúc độc đáo của Bill Bensley, ôm trọn bãi biển riêng tư.', 'HOTEL', 6),
(2, 'Sofitel Legend Metropole Hanoi', '15', 'Ngô Quyền', 'Tràng Tiền', 'Hoàn Kiếm', 'Hà Nội', 'LUXURY', 'ACTIVE', 'Khách sạn lịch sử hơn 100 tuổi, mang đậm phong cách kiến trúc Pháp cổ, trung tâm thủ đô.', 'HOTEL', 8),
(3, 'Vinpearl Resort & Spa Nha Trang Bay', 'Đảo Hòn Tre', 'Vịnh Nha Trang', 'Vĩnh Nguyên', 'Nha Trang', 'Khánh Hòa', 'UPSCALE', 'ACTIVE', 'Khu nghỉ dưỡng 5 sao nằm trọn trên đảo Hòn Tre với bãi biển riêng và công viên giải trí VinWonders.', 'HOTEL', 7),
(4, 'Topas Ecolodge Sapa', 'Thôn Lếch Dền', 'Xã Thanh Bình', 'Thanh Bình', 'Sa Pa', 'Lào Cai', 'UPSCALE', 'ACTIVE', 'Khu nghỉ dưỡng sinh thái trên đỉnh đồi với 41 bungalow biệt lập, tầm nhìn tuyệt đẹp ra thung lũng Mường Hoa.', 'HOTEL', 12),
(5, 'The Reverie Saigon', '22-36', 'Nguyễn Huệ', 'Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', 'LUXURY', 'ACTIVE', 'Khách sạn 6 sao duy nhất tại Việt Nam với nội thất Ý lộng lẫy, xa hoa bậc nhất trung tâm Sài Gòn.', 'HOTEL', 7),
(6, 'Hotel de l''Opera Hanoi - MGallery', '29', 'Tràng Tiền', 'Tràng Tiền', 'Hoàn Kiếm', 'Hà Nội', 'UPSCALE', 'ACTIVE', 'Khách sạn boutique 5 sao gần Nhà Hát Lớn, thiết kế sang trọng lấy cảm hứng từ kiến trúc Pháp.', 'HOTEL', 8),
(7, 'Amanoi Resort Ninh Thuận', 'Thôn Vĩnh Hy', 'Vườn Quốc Gia Núi Chúa', 'Vĩnh Hải', 'Ninh Hải', 'Ninh Thuận', 'LUXURY', 'ACTIVE', 'Resort 6 sao biệt lập, sang trọng bậc nhất Việt Nam, nơi nghỉ dưỡng của các ngôi sao thế giới.', 'HOTEL', 12),
(8, 'Six Senses Ninh Van Bay', 'Vịnh Ninh Vân', 'Phường Ninh Vân', 'Ninh Vân', 'Ninh Hòa', 'Khánh Hòa', 'LUXURY', 'ACTIVE', 'Resort 5 sao với các biệt thự có hồ bơi riêng, nằm biệt lập bên vịnh, chỉ có thể đến bằng thuyền.', 'HOTEL', 7),
(9, 'Little Riverside Hoi An', '09', 'Phan Bội Châu', 'Cẩm Châu', 'Hội An', 'Quảng Nam', 'MODERATE', 'ACTIVE', 'Khách sạn boutique 4 sao lãng mạn bên sông Hoài, gần phố cổ.', 'HOTEL', 10),
(10, 'Khách sạn Sài Gòn Morin Huế', '30/32', 'Lê Lợi', 'Phú Nhuận', 'TP. Huế', 'Thừa Thiên Huế', 'MODERATE', 'ACTIVE', 'Khách sạn 4 sao cổ nhất tại Huế, mang đậm dấu ấn kiến trúc Pháp.', 'HOTEL', 8),
-- RESTAURANTS (10)
(11, 'Anan Saigon', '89', 'Tôn Thất Đạm', 'Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', 'UPSCALE', 'ACTIVE', 'Nhà hàng Việt Nam hiện đại, sáng tạo, đạt sao Michelin. Nổi tiếng với món Phở 100 đô.', 'RESTAURANT', 9),
(12, 'Quán Ăn Ngon 138', '138', 'Nam Kỳ Khởi Nghĩa', 'Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', 'MODERATE', 'ACTIVE', 'Hội tụ tinh hoa ẩm thực 3 miền Bắc - Trung - Nam trong không gian truyền thống sân vườn.', 'RESTAURANT', 10),
(13, 'Bún Chả Hương Liên (Obama)', '24', 'Lê Văn Hưu', 'Phan Chu Trinh', 'Hai Bà Trưng', 'Hà Nội', 'BUDGET', 'ACTIVE', 'Quán bún chả nổi tiếng thế giới sau chuyến thăm của cựu tổng thống Obama.', 'RESTAURANT', 9),
(14, 'Pizza 4P''s Bến Thành', '8/15', 'Lê Thánh Tôn', 'Bến Thành', 'Quận 1', 'TP. Hồ Chí Minh', 'MODERATE', 'ACTIVE', 'Nhà hàng Pizza phong cách Nhật Bản nổi tiếng với phô mai Burrata tự làm tại chỗ.', 'RESTAURANT', 11),
(15, 'Morning Glory Original', '106', 'Nguyễn Thái Học', 'Minh An', 'Hội An', 'Quảng Nam', 'MODERATE', 'ACTIVE', 'Trải nghiệm ẩm thực Hội An đích thực trong không gian cổ kính, do Ms. Vy sáng lập.', 'RESTAURANT', 10),
(16, 'La Maison 1888', 'Bãi Bắc', 'Bán đảo Sơn Trà', 'Thọ Quang', 'Sơn Trà', 'Đà Nẵng', 'LUXURY', 'ACTIVE', 'Nhà hàng Pháp cao cấp 3 sao Michelin, nằm trong khuôn viên InterContinental Danang.', 'RESTAURANT', 6),
(17, 'Cục Gạch Quán', '10', 'Đặng Tất', 'Tân Định', 'Quận 1', 'TP. Hồ Chí Minh', 'MODERATE', 'ACTIVE', 'Nhà hàng chuyên món ăn gia đình Việt Nam trong không gian mộc mạc, ấm cúng.', 'RESTAURANT', 9),
(18, 'Nhà hàng Lemongrass', '04', 'Nguyễn Thiệp', 'Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', 'MODERATE', 'ACTIVE', 'Nhà hàng món Việt lâu đời tại Sài Gòn, nổi tiếng với món chả giò và cá chiên.', 'RESTAURANT', 11),
(19, 'Nhà hàng Cơm Niêu Sài Gòn', '59', 'Hồ Xuân Hương', 'Phường 6', 'Quận 3', 'TP. Hồ Chí Minh', 'BUDGET', 'ACTIVE', 'Chuyên các món cơm niêu, canh chua, cá kho tộ đậm chất Nam Bộ.', 'RESTAURANT', 10),
(20, 'Gánh Hàng Rong (Vinpearl Nha Trang)', 'Đảo Hòn Tre', 'Vịnh Nha Trang', 'Vĩnh Nguyên', 'Nha Trang', 'Khánh Hòa', 'MODERATE', 'ACTIVE', 'Nhà hàng buffet trong Vinpearl, chuyên các món ăn đường phố 3 miền.', 'RESTAURANT', 7),
-- VENUES (10) - (ĐÃ SỬA LỖI CỘT)
(21, 'Sun World Ba Na Hills', 'Thôn An Sơn', 'Đường lên Bà Nà', 'Hòa Ninh', 'Hòa Vang', 'Đà Nẵng', 'UPSCALE', 'ACTIVE', 'Khu du lịch trên đỉnh núi với Cầu Vàng, Làng Pháp, Fantasy Park.', 'VENUE', 6),
(22, 'Phố Cổ Hội An', 'Khu phố cổ', 'Trần Phú', 'Minh An', 'Hội An', 'Quảng Nam', 'BUDGET', 'ACTIVE', 'Di sản văn hóa thế giới UNESCO với những ngôi nhà cổ, đèn lồng và sông Hoài.', 'VENUE', 10),
(23, 'Vịnh Hạ Long', 'Cảng tàu', 'Tuần Châu', 'Tuần Châu', 'Hạ Long', 'Quảng Ninh', 'MODERATE', 'ACTIVE', 'Di sản thiên nhiên thế giới với hàng ngàn hòn đảo đá vôi kỳ vĩ.', 'VENUE', 7),
(24, 'Bảo tàng Chứng tích Chiến tranh', '28', 'Võ Văn Tần', 'Phường 6', 'Quận 3', 'TP. Hồ Chí Minh', 'BUDGET', 'ACTIVE', 'Nơi lưu giữ những hiện vật, hình ảnh về các cuộc chiến tranh tại Việt Nam.', 'VENUE', 13),
(25, 'Địa đạo Củ Chi', 'Ấp Phú Hiệp', 'Tỉnh lộ 15', 'Phú Mỹ Hưng', 'Củ Chi', 'TP. Hồ Chí Minh', 'BUDGET', 'ACTIVE', 'Hệ thống phòng thủ ngầm dài hơn 200km trong thời kỳ Chiến tranh Việt Nam.', 'VENUE', 14),
(26, 'Hoàng thành Thăng Long', '19C', 'Hoàng Diệu', 'Điện Biên', 'Ba Đình', 'Hà Nội', 'BUDGET', 'ACTIVE', 'Khu di tích lịch sử quan trọng bậc nhất Việt Nam, di sản văn hóa thế giới.', 'VENUE', 8),
(27, 'VinWonders Nha Trang', 'Đảo Hòn Tre', 'Vịnh Nha Trang', 'Vĩnh Nguyên', 'Nha Trang', 'Khánh Hòa', 'UPSCALE', 'ACTIVE', 'Công viên giải trí hiện đại với cáp treo vượt biển, trò chơi mạo hiểm và thủy cung.', 'VENUE', 7),
(28, 'Nhà hát Lớn Hà Nội', '01', 'Tràng Tiền', 'Tràng Tiền', 'Hoàn Kiếm', 'Hà Nội', 'UPSCALE', 'ACTIVE', 'Công trình kiến trúc Pháp tuyệt đẹp, nơi diễn ra các buổi hòa nhạc, opera lớn.', 'VENUE', 8),
(29, 'Dinh Độc Lập (Hội trường Thống Nhất)', '135', 'Nam Kỳ Khởi Nghĩa', 'Bến Thành', 'Quận 1', 'TP. Hồ Chí Minh', 'BUDGET', 'ACTIVE', 'Di tích lịch sử gắn liền với sự kiện 30/04/1975.', 'VENUE', 13),
(30, 'Nhà tù Hỏa Lò', '01', 'Hỏa Lò', 'Trần Hưng Đạo', 'Hoàn Kiếm', 'Hà Nội', 'BUDGET', 'ACTIVE', 'Di tích lịch sử về thời kỳ chiến tranh thuộc Pháp và Mỹ.', 'VENUE', 13);


/* ================================================================
 BẢNG LEVEL 3 (SUBCLASSES & M-N RELATIONSHIPS)
================================================================
*/

-- 17. HOTEL (10 Dòng)
TRUNCATE TABLE HOTEL;
INSERT INTO HOTEL (hotelID, officialStarRating, standardCheckinTime, standardCheckOutTime) VALUES
(1, 5, '15:00:00', '12:00:00'),
(2, 5, '14:00:00', '12:00:00'),
(3, 5, '14:00:00', '12:00:00'),
(4, 4.5, '14:00:00', '11:00:00'),
(5, 5, '15:00:00', '12:00:00'),
(6, 5, '14:00:00', '12:00:00'),
(7, 5, '15:00:00', '12:00:00'),
(8, 5, '14:00:00', '12:00:00'),
(9, 4, '14:00:00', '12:00:00'),
(10, 4, '14:00:00', '12:00:00');

-- 18. RESTAURANT (10 Dòng)
TRUNCATE TABLE RESTAURANT;
INSERT INTO RESTAURANT (restaurantID, cuisineType, menuURL) VALUES
(11, 'Việt Nam Hiện Đại', 'https://anansaigon.com/menu'),
(12, 'Việt Nam Truyền Thống', 'https://ngonhanoi.com.vn/menu'),
(13, 'Việt Nam (Bún Chả)', NULL),
(14, 'Pizza & Mì Ý', 'https://pizza4ps.com/menu'),
(15, 'Việt Nam (Hội An)', NULL),
(16, 'Pháp Cao Cấp', 'https://www.danang.intercontinental.com/la-maison-1888'),
(17, 'Việt Nam Gia Đình', NULL),
(18, 'Việt Nam Cổ điển', NULL),
(19, 'Việt Nam (Cơm Niêu)', NULL),
(20, 'Buffet Quốc Tế', NULL);

-- 19. ENTERTAINMENT_VENUE (10 Dòng)
TRUNCATE TABLE ENTERTAINMENT_VENUE;
INSERT INTO ENTERTAINMENT_VENUE (EVID, attractionType, targetAudience) VALUES
(21, 'Công viên giải trí', 'Gia đình, Cặp đôi'),
(22, 'Di sản văn hóa', 'Mọi đối tượng'),
(23, 'Di sản thiên nhiên', 'Mọi đối tượng'),
(24, 'Bảo tàng Lịch sử', 'Người lớn, Sinh viên, Người nước ngoài'),
(25, 'Di tích lịch sử', 'Người lớn, Sinh viên, Cựu chiến binh'),
(26, 'Di tích lịch sử', 'Mọi đối tượng'),
(27, 'Công viên giải trí', 'Gia đình, Thanh thiếu niên'),
(28, 'Nhà hát nghệ thuật', 'Cặp đôi, Người lớn, Người yêu nghệ thuật'),
(29, 'Di tích lịch sử', 'Mọi đối tượng'),
(30, 'Di tích lịch sử', 'Người lớn, Sinh viên');

-- 20. LOCATION_OPENING_HOURS (30 Dòng)
-- (dayOfWeek: 0=CN, 1=T2, ..., 6=T7)
TRUNCATE TABLE LOCATION_OPENING_HOURS;
INSERT INTO LOCATION_OPENING_HOURS (locID, dayOfWeek, openTime, closeTime) VALUES
-- Khách sạn (Lễ tân 24/7)
(1, 0, '00:00:00', '23:59:59'), (1, 1, '00:00:00', '23:59:59'), (1, 2, '00:00:00', '23:59:59'), (1, 3, '00:00:00', '23:59:59'), (1, 4, '00:00:00', '23:59:59'), (1, 5, '00:00:00', '23:59:59'), (1, 6, '00:00:00', '23:59:59'),
-- Anan Saigon (Nhà hàng, nghỉ T2)
(11, 2, '17:00:00', '23:00:00'), (11, 3, '17:00:00', '23:00:00'), (11, 4, '17:00:00', '23:00:00'), (11, 5, '17:00:00', '23:00:00'), (11, 6, '17:00:00', '23:00:00'), (11, 0, '17:00:00', '23:00:00'),
-- Quán Ăn Ngon (Nhà hàng)
(12, 0, '07:30:00', '22:30:00'), (12, 1, '07:30:00', '22:30:00'), (12, 2, '07:30:00', '22:30:00'), (12, 3, '07:30:00', '22:30:00'), (12, 4, '07:30:00', '22:30:00'), (12, 5, '07:30:00', '22:30:00'), (12, 6, '07:30:00', '22:30:00'),
-- Bà Nà Hills (Venue)
(21, 0, '08:00:00', '19:00:00'), (21, 1, '08:00:00', '19:00:00'), (21, 2, '08:00:00', '19:00:00'), (21, 3, '08:00:00', '19:00:00'), (21, 4, '08:00:00', '19:00:00'), (21, 5, '08:00:00', '21:00:00'), (21, 6, '08:00:00', '21:00:00'),
-- Bảo tàng CTCT (Venue, nghỉ T2)
(24, 0, '07:30:00', '17:30:00'), (24, 2, '07:30:00', '17:30:00'), (24, 3, '07:30:00', '17:30:00'), (24, 4, '07:30:00', '17:30:00'), (24, 5, '07:30:00', '17:30:00'), (24, 6, '07:30:00', '17:30:00');

-- 21. ENTERTAINMENT_VENUE_DUE (10 Dòng)
TRUNCATE TABLE ENTERTAINMENT_VENUE_DUE;
INSERT INTO ENTERTAINMENT_VENUE_DUE (EVID, dayOfWeek, startTime, endTime) VALUES
(21, 'Friday', '19:00:00', '21:00:00'), -- Bà Nà (Show diễn tối T6)
(21, 'Saturday', '19:00:00', '21:00:00'), -- Bà Nà (Show diễn tối T7)
(22, 'Saturday', '18:00:00', '21:00:00'), -- Hội An (Phố đi bộ cuối tuần)
(22, 'Sunday', '18:00:00', '21:00:00'), -- Hội An (Phố đi bộ cuối tuần)
(22, 'Daily', '00:00:00', '23:59:59'), -- Hội An (Mở cửa tự do cả ngày)
(28, 'Saturday', '20:00:00', '22:00:00'), -- Nhà Hát Lớn (Show hòa nhạc T7)
(28, 'Sunday', '20:00:00', '22:00:00'), -- Nhà Hát Lớn (Show hòa nhạc CN)
(23, 'Daily', '08:00:00', '12:00:00'), -- Vịnh Hạ Long (Tàu sáng)
(23, 'Daily', '13:00:00', '17:00:00'), -- Vịnh Hạ Long (Tàu chiều)
(30, 'Daily', '08:00:00', '17:00:00'); -- Hỏa Lò

-- 22. LOC_HAS_UTILITY (50 Dòng)
TRUNCATE TABLE LOC_HAS_UTILITY;
INSERT INTO LOC_HAS_UTILITY (locID, utility) VALUES
-- InterCon (15 tiện ích)
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11), (1, 14), (1, 15), (1, 16), (1, 19), (1, 20),
-- Metropole (10 tiện ích)
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9), (2, 11), (2, 14), (2, 17), (2, 19), (2, 20),
-- Vinpearl (10 tiện ích)
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 7), (3, 8), (3, 10), (3, 13), (3, 15), (3, 17), (3, 20),
-- Topas (5 tiện ích)
(4, 1), (4, 2), (4, 3), (4, 4), (4, 8), (4, 26),
-- Reverie (10 tiện ích)
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6), (5, 7), (5, 8), (5, 9), (5, 14), (5, 17), (5, 19), (5, 20),
-- Anan Saigon (5 tiện ích)
(11, 1), (11, 5), (11, 17), (11, 20),
-- Quán Ăn Ngon (5 tiện ích)
(12, 1), (12, 3), (12, 17), (12, 20), (12, 28),
-- Bà Nà Hills (5 tiện ích)
(21, 1), (21, 3), (21, 4), (21, 20), (21, 28),
-- Bảo tàng (3 tiện ích)
(24, 1), (24, 3), (24, 28);

-- 23. LOCATION_HAS_PREFERENCE (50 Dòng)
TRUNCATE TABLE LOCATION_HAS_PREFERENCE;
INSERT INTO LOCATION_HAS_PREFERENCE (locID, prefID) VALUES
(1, 1), (1, 3), (1, 6), (1, 10), (1, 15), (1, 17), (1, 21), (1, 24), (1, 25), -- InterCon
(2, 3), (2, 6), (2, 11), (2, 12), (2, 13), (2, 21), (2, 25), (2, 20), -- Metropole
(3, 1), (3, 3), (3, 5), (3, 17), (3, 24), (3, 9), (3, 20), -- Vinpearl Nha Trang
(4, 2), (4, 3), (4, 6), (4, 10), (4, 15), (4, 19), (4, 23), (4, 25), -- Topas
(5, 3), (5, 6), (5, 13), (5, 20), (5, 21), (5, 25), -- Reverie
(11, 8), (11, 3), (11, 14), (11, 20), (11, 21), (11, 25), -- Anan Saigon
(12, 8), (12, 4), (12, 5), (12, 11), (12, 26), -- Quán Ăn Ngon
(13, 8), (13, 4), (13, 11), (13, 26), -- Bún Chả HL
(21, 5), (21, 6), (21, 9), (21, 18), (21, 20), (21, 25), -- Bà Nà
(22, 11), (22, 12), (22, 13), (22, 18), (22, 19), (22, 21), (22, 26), -- Hội An
(23, 1), (23, 9), (23, 15), (23, 23), (23, 25), -- Vịnh Hạ Long
(24, 12), (24, 11), (24, 22), -- Bảo tàng
(25, 12), (25, 9), (25, 15); -- Củ Chi

-- 24. LOCATION_HAS_PRODUCT (40 Dòng)
TRUNCATE TABLE LOCATION_HAS_PRODUCT;
INSERT INTO LOCATION_HAS_PRODUCT (locID, productID) VALUES
-- Khách sạn -> Phòng
(1, 1), (1, 6), (1, 8), (1, 9), (1, 31), (1, 32), -- InterCon
(2, 2), (2, 6), (2, 31), (2, 32), -- Metropole
(3, 3), (3, 9), (3, 29), (3, 31), (3, 32), -- Vinpearl (có cả vé VinWonders)
(4, 4), -- Topas
(5, 5), (5, 6), (5, 31), -- Reverie
(9, 31), (9, 32), -- Little Riverside
-- Nhà hàng -> Bàn
(11, 11), (11, 12), (11, 13), (11, 16), -- Anan Saigon
(12, 11), (12, 12), (12, 14), (12, 18), (12, 33), -- Quán Ăn Ngon
(13, 11), (13, 12), -- Bún Chả
(14, 11), (14, 12), (14, 15), (14, 18), -- Pizza 4P
(16, 11), (16, 15), (16, 16), -- La Maison 1888
-- Venue -> Vé
(21, 21), (21, 22), (21, 27), -- Bà Nà
(22, 23), (22, 28), -- Hội An
(23, 24), -- Hạ Long
(24, 25), -- Bảo tàng
(25, 26), -- Củ Chi
(27, 29), -- VinWonders (bán vé riêng)
(29, 34), -- Dinh Độc Lập
(30, 35); -- Rối Nước

-- 25. LOC_HAS_IMAGE (40 Dòng)
TRUNCATE TABLE LOC_HAS_IMAGE;
INSERT INTO LOC_HAS_IMAGE (locID, imageID) VALUES
(1, 11), (1, 30), (1, 31), (1, 32), -- InterCon (1 hero, 3 review photos)
(2, 12), (2, 30), (2, 31),
(3, 13), (3, 30), (3, 31),
(4, 14), (4, 32),
(5, 15), (5, 30),
(6, 12), (6, 31), -- Hotel Opera (share ảnh Metropole)
(7, 11), (7, 32), -- Amanoi
(8, 13), (8, 30), -- Six Senses
(9, 22), (9, 31), -- Little Riverside
(10, 24), (10, 32), -- Morin Huế
(11, 16), (11, 30), (11, 31), (11, 32),
(12, 17), (12, 30), (12, 31),
(13, 18), (13, 32),
(14, 19), (14, 30),
(15, 20), (15, 31),
(21, 21), (21, 30), (21, 31), (21, 32),
(22, 22), (22, 30), (22, 31), (22, 32),
(23, 23), (23, 30),
(24, 24), (24, 31),
(25, 25), (25, 32);

/* ================================================================
 BẢNG LEVEL 4 (TRANSACTIONS & FEEDBACK CORE)
================================================================
*/

-- 26. RESERVATION (30 Dòng)
-- (touristID từ 16-35)
-- (voucherID từ 1-15, có thể NULL)
TRUNCATE TABLE RESERVATION;
INSERT INTO RESERVATION (reservationID, touristID, voucherID, status, note, resTimeStamp) VALUES
(1, 16, 1, 'COMPLETED', 'Xin phòng view đẹp, tầng cao. Kỷ niệm 5 năm ngày cưới.', '2025-10-01 10:30:00'),
(2, 16, 10, 'PENDING', 'Check-in sớm lúc 13:00 nếu có thể.', '2025-11-10 11:00:00'),  -- Tourist 16 is Silver (rank 1), can use voucher 10 (rank 1)
(3, 17, 2, 'COMPLETED', 'Bàn cạnh cửa sổ, view bếp mở.', '2025-01-05 14:00:00'),
(4, 18, NULL, 'COMPLETED', 'Gia đình có 1 trẻ nhỏ 3 tuổi.', '2025-10-10 09:15:00'),
(5, 19, 1, 'CANCELLED', 'Thay đổi kế hoạch đột xuất, xin lỗi.', '2025-10-15 17:45:00'),
(6, 20, NULL, 'COMPLETED', 'Đi 2 người.', '2025-10-20 08:00:00'),
(7, 21, NULL, 'COMPLETED', 'Xin hướng dẫn viên nhiệt tình.', '2025-10-22 11:20:00'),
(8, 22, 4, 'COMPLETED', 'Honeymoon trip. Please setup lãng mạn.', '2025-10-25 19:00:00'),
(9, 23, NULL, 'COMPLETED', 'Merci beaucoup! Request late check-out.', '2025-10-28 16:10:00'),
(10, 24, NULL, 'COMPLETED', 'Xin bàn ngoài trời nếu thời tiết đẹp.', '2025-11-01 12:00:00'),
(11, 25, 6, 'COMPLETED', 'Cho 2 trẻ em đi cùng, xin 1 ghế em bé.', '2025-11-02 13:00:00'),
(12, 16, 13, 'COMPLETED', 'Đặt vé tham quan và buffet trưa.', '2025-11-03 14:30:00'),
(13, 17, 6, 'CONFIRMED', 'Đặt bàn cho 4 người, tổ chức sinh nhật.', '2025-11-11 10:00:00'),
(14, 18, 10, 'PENDING', 'Đi gia đình 3 người, 1 trẻ 5 tuổi.', '2025-11-12 15:00:00'),
(15, 19, 12, 'CONFIRMED', 'Đặt phòng 2 người, không hút thuốc.', '2025-11-13 18:00:00'),
(16, 20, NULL, 'COMPLETED', 'Tham quan di tích.', '2025-10-25 09:00:00'),
(17, 21, NULL, 'COMPLETED', 'Tham quan Vịnh, đi tàu 4 tiếng.', '2025-10-30 07:00:00'),
(18, 22, NULL, 'COMPLETED', 'Ăn tối sang trọng, bàn 2 người.', '2025-11-05 20:00:00'),
(19, 23, NULL, 'COMPLETED', 'Xem di tích chiến tranh, 2 người.', '2025-11-06 13:30:00'),
(20, 24, NULL, 'COMPLETED', 'Ăn bún chả, 4 người.', '2025-11-07 11:00:00'),
(21, 25, 6, 'PENDING', 'Đặt bàn cuối tuần cho gia đình 8 người.', '2025-11-14 10:20:00'),
(22, 16, 5, 'CANCELLED', 'Trùng lịch công tác đột xuất.', '2025-11-01 16:00:00'),
(23, 17, NULL, 'COMPLETED', 'Ăn tối với gia đình 4 người.', '2025-11-08 19:30:00'),
(24, 18, 10, 'CONFIRMED', 'Tham quan Củ Chi 3 vé.', '2025-11-15 08:00:00'),
(25, 19, 1, 'PENDING', 'Đặt phòng 2 đêm, xin 2 giường đơn.', '2025-11-15 11:00:00'),  -- Tourist 19 is Bronze (rank 0), can use voucher 1 (rank 0)
(26, 26, 14, 'COMPLETED', 'New user booking, 2 tickets.', '2025-10-15 10:00:00'),
(27, 27, 14, 'COMPLETED', 'Booking for 2 people.', '2025-10-18 11:00:00'),
(28, 28, 14, 'COMPLETED', 'Đặt vé cho 1 người.', '2025-10-20 12:00:00'),
(29, 29, 1, 'COMPLETED', 'Đặt phòng cho công tác 3 đêm.', '2025-10-22 13:00:00'),
(30, 30, 13, 'COMPLETED', 'Đặt 2 vé VinWonders.', '2025-10-25 14:00:00');

-- 27. BOOKING_DETAILS (35 Dòng)
-- (itemID được quản lý thủ công, bắt đầu từ 1 cho mỗi reservationID)
TRUNCATE TABLE BOOKING_DETAILS;
INSERT INTO BOOKING_DETAILS (reservationID, itemID, productID, quantity, unitPrice, checkingDateTime, checkoutDateTime) VALUES
(1, 1, 1, 2, 8500000, '2025-10-10 15:00:00', '2025-10-12 12:00:00'), -- Lộc @ InterCon (2 đêm)
(2, 1, 4, 1, 7000000, '2025-11-20 14:00:00', '2025-11-22 11:00:00'), -- Lộc @ Topas
(3, 1, 13, 1, 100000, '2025-01-08 19:00:00', '2025-01-08 21:00:00'), -- Thông @ Anan Saigon (Bàn view bếp)
(4, 1, 3, 1, 4500000, '2025-10-15 14:00:00', '2025-10-18 12:00:00'), -- Vy @ Vinpearl (3 đêm)
(5, 1, 1, 1, 8500000, '2025-10-20 15:00:00', '2025-10-21 12:00:00'), -- Bích Phương (Đã hủy)
(6, 1, 23, 2, 120000, '2025-10-25 08:00:00', '2025-10-25 17:00:00'), -- Minh Tuấn @ Hội An
(7, 1, 24, 2, 290000, '2025-10-28 08:00:00', '2025-10-28 12:00:00'), -- Anh Đào @ Hạ Long
(8, 1, 5, 2, 10000000, '2025-11-01 15:00:00', '2025-11-03 12:00:00'), -- David Teo @ Reverie (2 đêm)
(9, 1, 2, 3, 12000000, '2025-11-05 14:00:00', '2025-11-08 12:00:00'), -- Sophie @ Metropole (3 đêm)
(10, 1, 11, 1, 0, '2025-11-05 12:00:00', '2025-11-05 13:00:00'), -- Trần Quảng @ Morning Glory
(11, 1, 18, 1, 0, '2025-11-05 19:00:00', '2025-11-05 21:00:00'), -- Mai Anh @ Quán Ăn Ngon (Bàn 8)
(12, 1, 21, 2, 900000, '2025-11-06 08:00:00', '2025-11-06 17:00:00'), -- Lộc @ Bà Nà (Vé NL)
(12, 2, 27, 2, 350000, '2025-11-06 12:00:00', '2025-11-06 14:00:00'), -- Lộc @ Bà Nà (Buffet)
(13, 1, 12, 1, 0, '2025-11-20 19:30:00', '2025-11-20 21:30:00'), -- Thông @ Quán Ăn Ngon
(14, 1, 31, 1, 1500000, '2025-12-01 14:00:00', '2025-12-02 12:00:00'), -- Vy @ Vinpearl (Phòng khác)
(15, 1, 1, 1, 8500000, '2025-12-05 15:00:00', '2025-12-07 12:00:00'), -- Bích Phương
(16, 1, 25, 2, 40000, '2025-10-26 09:00:00', '2025-10-26 11:00:00'), -- Minh Tuấn @ Bảo tàng
(17, 1, 24, 1, 290000, '2025-11-01 08:00:00', '2025-11-01 12:00:00'), -- Anh Đào @ Hạ Long
(18, 1, 16, 1, 500000, '2025-11-10 20:00:00', '2025-11-10 22:00:00'), -- David Teo @ Anan (VIP)
(19, 1, 25, 2, 40000, '2025-11-10 14:00:00', '2025-11-10 16:00:00'), -- Sophie @ Bảo tàng
(20, 1, 12, 2, 0, '2025-11-10 12:00:00', '2025-11-10 13:00:00'), -- Trần Quảng @ Bún Chả
(21, 1, 18, 1, 0, '2025-11-25 19:00:00', '2025-11-25 21:00:00'), -- Mai Anh
(22, 1, 1, 1, 8500000, '2025-11-10 15:00:00', '2025-11-11 12:00:00'), -- Lộc (Đã hủy)
(23, 1, 15, 1, 50000, '2025-11-12 19:00:00', '2025-11-12 21:00:00'), -- Thông @ Pizza 4P
(24, 1, 26, 3, 70000, '2025-11-28 09:00:00', '2025-11-28 12:00:00'), -- Vy @ Củ Chi
(25, 1, 32, 1, 1800000, '2025-12-10 14:00:00', '2025-12-12 12:00:00'), -- Bích Phương
(26, 1, 30, 2, 200000, '2025-10-20 09:00:00', '2025-10-20 11:00:00'), -- John Doe @ Hoàng thành
(27, 1, 24, 2, 290000, '2025-10-22 08:00:00', '2025-10-22 12:00:00'), -- Kenji @ Hạ Long
(28, 1, 35, 1, 200000, '2025-01-25 20:00:00', '2025-01-25 21:00:00'), -- Min-jun @ Rối nước
(29, 1, 2, 3, 12000000, '2025-11-01 14:00:00', '2025-11-04 12:00:00'), -- Anh Tuấn @ Metropole
(30, 1, 29, 2, 880000, '2025-11-10 09:00:00', '2025-11-10 18:00:00'); -- Thùy Linh @ VinWonders

-- 28. TRANSACTION (30 Dòng)
TRUNCATE TABLE `TRANSACTION`;
INSERT INTO `TRANSACTION` (transactionID, reservationID, paidAmount, paymentMethod, status, gatewayTransactionID, transactionDateTime) VALUES
(1, 1, 16900000, 'VNPAY', 'COMPLETED', 'VNPAY_1001', '2025-10-01 10:31:00'), -- Lộc (17M - 100k (Voucher 1))
(2, 3, 80000, 'MOMO', 'COMPLETED', 'MOMO_1001', '2025-01-05 14:01:00'), -- Thông (100k - 20k (Voucher 2))
(3, 4, 13500000, 'CREDIT_CARD', 'COMPLETED', 'STRIPE_1001', '2025-10-10 09:16:00'), -- Vy (3 đêm * 4.5M)
(4, 5, 8500000, 'VNPAY', 'FAILED', 'VNPAY_1002', '2025-10-15 17:46:00'), -- Bích Phương (Hủy)
(5, 6, 240000, 'MOMO', 'COMPLETED', 'MOMO_1002', '2025-10-20 08:01:00'), -- Minh Tuấn @ Hội An
(6, 7, 580000, 'CREDIT_CARD', 'COMPLETED', 'STRIPE_1002', '2025-10-22 11:21:00'), -- Anh Đào @ Hạ Long
(7, 8, 18000000, 'CREDIT_CARD', 'COMPLETED', 'STRIPE_1003', '2025-10-25 19:01:00'), -- David Teo @ Reverie (20M. Voucher 4. Final = 18M)
(8, 9, 36000000, 'CREDIT_CARD', 'COMPLETED', 'STRIPE_1004', '2025-10-28 16:11:00'), -- Sophie @ Metropole (3 đêm * 12M)
(9, 10, 300000, 'CASH', 'COMPLETED', 'CASH_1001', '2025-11-05 13:00:00'), -- Trần Quảng (Giả sử trả 300k)
(10, 11, 400000, 'MOMO', 'COMPLETED', 'MOMO_1003', '2025-11-02 13:01:00'), -- Mai Anh (450k. Voucher 6. Final = 400k)
(11, 12, 2450000, 'VNPAY', 'COMPLETED', 'VNPAY_1003', '2025-11-03 14:31:00'), -- Lộc (2.5M. Voucher 13. Final = 2.45M)
(12, 13, 100000, 'MOMO', 'PENDING', 'MOMO_1004', '2025-11-11 10:01:00'), -- Thông (Đang chờ)
(13, 15, 500000, 'CREDIT_CARD', 'PENDING', 'STRIPE_1005', '2025-11-13 18:01:00'), -- Bích Phương (Đang chờ)
(14, 16, 80000, 'CASH', 'COMPLETED', 'CASH_1002', '2025-10-26 09:30:00'), -- Minh Tuấn @ Bảo tàng
(15, 17, 290000, 'MOMO', 'COMPLETED', 'MOMO_1005', '2025-10-30 07:01:00'), -- Anh Đào @ Hạ Long
(16, 18, 500000, 'CREDIT_CARD', 'COMPLETED', 'STRIPE_1006', '2025-11-05 20:01:00'), -- David Teo @ Anan (VIP)
(17, 19, 80000, 'CASH', 'COMPLETED', 'CASH_1003', '2025-11-06 14:00:00'), -- Sophie @ Bảo tàng
(18, 20, 100000, 'CASH', 'COMPLETED', 'CASH_1004', '2025-11-07 12:30:00'), -- Trần Quảng @ Bún Chả
(19, 23, 50000, 'VNPAY', 'COMPLETED', 'VNPAY_1004', '2025-11-08 19:31:00'), -- Thông @ Pizza 4P
(20, 24, 100000, 'MOMO', 'PENDING', 'MOMO_1006', '2025-11-15 08:01:00'), -- Vy @ Củ Chi
(21, 26, 370000, 'VNPAY', 'COMPLETED', 'VNPAY_1005', '2025-10-15 10:01:00'), -- John Doe @ Hoàng thành (400k - 30k (Voucher 14))
(22, 27, 550000, 'MOMO', 'COMPLETED', 'MOMO_1007', '2025-10-18 11:01:00'), -- Kenji @ Hạ Long (580k - 30k (Voucher 14))
(23, 28, 170000, 'CREDIT_CARD', 'COMPLETED', 'STRIPE_1007', '2025-01-20 12:01:00'), -- Min-jun @ Rối nước (200k - 30k (Voucher 14))
(24, 29, 35900000, 'CREDIT_CARD', 'COMPLETED', 'STRIPE_1008', '2025-10-22 13:01:00'), -- Anh Tuấn @ Metropole (36M - 100k (Voucher 1))
(25, 30, 1710000, 'VNPAY', 'COMPLETED', 'VNPAY_1007', '2025-10-25 14:01:00'), -- Thùy Linh @ VinWonders (1.76M. Voucher 13. Final = 1.71M)
(26, 2, 1000000, 'MOMO', 'PENDING', 'MOMO_1008', '2025-11-10 11:01:00'), -- Lộc @ Topas (Đang chờ)
(27, 14, 500000, 'VNPAY', 'PENDING', 'VNPAY_1008', '2025-11-12 15:01:00'), -- Vy @ Vinpearl (Đang chờ)
(28, 21, 300000, 'MOMO', 'PENDING', 'MOMO_1009', '2025-11-14 10:21:00'), -- Mai Anh (Đang chờ)
(29, 25, 1000000, 'CREDIT_CARD', 'PENDING', 'STRIPE_1009', '2025-11-15 11:01:00'), -- Bích Phương (Đang chờ)
(30, 1, 100000, 'VNPAY', 'COMPLETED', 'VNPAY_1010', '2025-10-01 10:32:00'); -- Thanh toán thêm cho Res 1

-- 29. FEEDBACK (75 Dòng)
-- -- (Mỗi location 5 feedback: 3 review, 2 comment)
-- TRUNCATE TABLE FEEDBACK;
-- INSERT INTO FEEDBACK (fbID, userID, locID, feedbackType, fbDateTime) VALUES
-- -- Loc 1: InterContinental (5)
-- (1, 16, 1, 'REVIEW', '2025-10-13 10:00:00'), -- Lộc (ResID 1)
-- (2, 6, 1, 'COMMENT', '2025-10-13 11:00:00'), -- Owner Reply
-- (3, 17, 1, 'COMMENT', '2025-10-14 09:00:00'), -- Thông (User Reply)
-- (4, 22, 1, 'REVIEW', '2025-11-05 10:00:00'), -- David Teo (ResID 8)
-- (5, 23, 1, 'REVIEW', '2025-11-09 10:00:00'), -- Sophie (ResID 9)
-- -- Loc 2: Metropole (5)
-- (6, 23, 2, 'REVIEW', '2025-11-09 14:00:00'), -- Sophie (ResID 9)
-- (7, 8, 2, 'COMMENT', '2025-11-09 15:00:00'), -- Owner Reply
-- (8, 29, 2, 'REVIEW', '2025-11-05 08:00:00'), -- Anh Tuấn (ResID 29)
-- (9, 20, 2, 'REVIEW', '2025-11-10 10:00:00'), -- Minh Tuấn
-- (10, 1, 2, 'COMMENT', '2025-11-10 11:00:00'), -- Admin Reply
-- -- Loc 3: Vinpearl Nha Trang (5)
-- (11, 18, 3, 'REVIEW', '2025-10-19 09:00:00'), -- Vy (ResID 4)
-- (12, 7, 3, 'COMMENT', '2025-10-19 10:00:00'), -- Owner Reply
-- (13, 25, 3, 'REVIEW', '2025-11-03 10:00:00'), -- Mai Anh
-- (14, 30, 3, 'REVIEW', '2025-10-26 10:00:00'), -- Thùy Linh (ResID 30)
-- (15, 16, 3, 'COMMENT', '2025-10-26 11:00:00'), -- Lộc (User Reply)
-- -- Loc 4: Topas Ecolodge (5)
-- (16, 21, 4, 'REVIEW', '2025-11-01 10:00:00'), -- Anh Đào
-- (17, 12, 4, 'COMMENT', '2025-11-01 11:00:00'), -- Owner Reply
-- (18, 31, 4, 'REVIEW', '2025-11-05 10:00:00'), -- Peter
-- (19, 32, 4, 'REVIEW', '2025-11-06 10:00:00'), -- Maria
-- (20, 16, 4, 'COMMENT', '2025-11-06 11:00:00'), -- Lộc (User Reply)
-- -- Loc 5: Reverie (5)
-- (21, 22, 5, 'REVIEW', '2025-11-04 10:00:00'), -- David Teo (ResID 8)
-- (22, 7, 5, 'COMMENT', '2025-11-04 11:00:00'), -- Owner Reply
-- (23, 27, 5, 'REVIEW', '2025-11-05 10:00:00'), -- Kenji
-- (24, 28, 5, 'REVIEW', '2025-11-06 10:00:00'), -- Min-jun
-- (25, 23, 5, 'COMMENT', '2025-11-06 11:00:00'), -- Sophie (User Reply)
-- -- Loc 11: Anan Saigon (5)
-- (26, 17, 11, 'REVIEW', '2025-01-09 10:00:00'), -- Thông (ResID 3)
-- (27, 9, 11, 'COMMENT', '2025-01-09 11:00:00'), -- Owner Reply
-- (28, 22, 11, 'REVIEW', '2025-11-11 10:00:00'), -- David Teo (ResID 18)
-- (29, 16, 11, 'COMMENT', '2025-11-11 11:00:00'), -- Lộc (User Reply)
-- (30, 23, 11, 'REVIEW', '2025-11-12 10:00:00'), -- Sophie
-- -- Loc 12: Quán Ăn Ngon (5)
-- (31, 25, 12, 'REVIEW', '2025-11-06 10:00:00'), -- Mai Anh (ResID 11)
-- (32, 10, 12, 'COMMENT', '2025-11-06 11:00:00'), -- Owner Reply
-- (33, 17, 12, 'REVIEW', '2025-11-09 10:00:00'), -- Thông (ResID 23)
-- (34, 18, 12, 'REVIEW', '2025-11-10 10:00:00'), -- Vy
-- (35, 16, 12, 'COMMENT', '2025-11-10 11:00:00'), -- Lộc (User Reply)
-- -- Loc 13: Bún Chả HL (5)
-- (36, 24, 13, 'REVIEW', '2025-11-08 10:00:00'), -- Trần Quảng (ResID 20)
-- (37, 9, 13, 'COMMENT', '2025-11-08 11:00:00'), -- Owner Reply
-- (38, 20, 13, 'REVIEW', '2025-11-09 10:00:00'), -- Minh Tuấn
-- (39, 29, 13, 'REVIEW', '2025-11-10 10:00:00'), -- Anh Tuấn
-- (40, 17, 13, 'COMMENT', '2025-11-10 11:00:00'), -- Thông (User Reply)
-- -- Loc 14: Pizza 4P's (5)
-- (41, 17, 14, 'REVIEW', '2025-11-13 10:00:00'), -- Thông (ResID 23)
-- (42, 11, 14, 'COMMENT', '2025-11-13 11:00:00'), -- Owner Reply
-- (43, 19, 14, 'REVIEW', '2025-11-14 10:00:00'), -- Bích Phương
-- (44, 18, 14, 'REVIEW', '2025-11-15 10:00:00'), -- Vy
-- (45, 16, 14, 'COMMENT', '2025-11-15 11:00:00'), -- Lộc (User Reply)
-- -- Loc 15: Morning Glory (5)
-- (46, 24, 15, 'REVIEW', '2025-11-06 10:00:00'), -- Trần Quảng (ResID 10)
-- (47, 10, 15, 'COMMENT', '2025-11-06 11:00:00'), -- Owner Reply
-- (48, 20, 15, 'REVIEW', '2025-11-07 10:00:00'), -- Minh Tuấn
-- (49, 18, 15, 'REVIEW', '2025-11-08 10:00:00'), -- Vy
-- (50, 19, 15, 'COMMENT', '2025-11-08 11:00:00'), -- Bích Phương (User Reply)
-- -- Loc 21: Bà Nà Hills (5)
-- (51, 16, 21, 'REVIEW', '2025-11-07 10:00:00'), -- Lộc (ResID 12)
-- (52, 6, 21, 'COMMENT', '2025-11-07 11:00:00'), -- Owner Reply
-- (53, 18, 21, 'REVIEW', '2025-11-08 10:00:00'), -- Vy
-- (54, 19, 21, 'REVIEW', '2025-11-09 10:00:00'), -- Bích Phương
-- (55, 17, 21, 'COMMENT', '2025-11-09 11:00:00'), -- Thông (User Reply)
-- -- Loc 22: Hội An (5)
-- (56, 20, 22, 'REVIEW', '2025-10-26 10:00:00'), -- Minh Tuấn (ResID 6)
-- (57, 10, 22, 'COMMENT', '2025-10-26 11:00:00'), -- Owner Reply
-- (58, 23, 22, 'REVIEW', '2025-10-30 10:00:00'), -- Sophie
-- (59, 18, 22, 'REVIEW', '2025-11-01 10:00:00'), -- Vy
-- (60, 21, 22, 'COMMENT', '2025-11-01 11:00:00'), -- Anh Đào (User Reply)
-- -- Loc 23: Vịnh Hạ Long (5)
-- (61, 21, 23, 'REVIEW', '2025-10-29 10:00:00'), -- Anh Đào (ResID 7)
-- (62, 7, 23, 'COMMENT', '2025-10-29 11:00:00'), -- Owner Reply
-- (63, 27, 23, 'REVIEW', '2025-10-23 10:00:00'), -- Kenji (ResID 27)
-- (64, 30, 23, 'REVIEW', '2025-11-01 10:00:00'), -- Thùy Linh
-- (65, 16, 23, 'COMMENT', '2025-11-01 11:00:00'), -- Lộc (User Reply)
-- -- Loc 24: Bảo tàng CTCT (5)
-- (66, 20, 24, 'REVIEW', '2025-10-27 10:00:00'), -- Minh Tuấn (ResID 16)
-- (67, 13, 24, 'COMMENT', '2025-10-27 11:00:00'), -- Owner Reply
-- (68, 23, 24, 'REVIEW', '2025-11-07 10:00:00'), -- Sophie (ResID 19)
-- (69, 26, 24, 'REVIEW', '2025-11-08 10:00:00'), -- John Doe
-- (70, 2, 24, 'COMMENT', '2025-11-08 11:00:00'), -- Admin Reply
-- -- Loc 25: Địa đạo Củ Chi (5)
-- (71, 32, 25, 'REVIEW', '2025-11-01 10:00:00'), -- Maria
-- (72, 14, 25, 'COMMENT', '2025-11-01 11:00:00'), -- Owner Reply
-- (73, 20, 25, 'REVIEW', '2025-11-05 10:00:00'), -- Minh Tuấn
-- (74, 33, 25, 'REVIEW', '2025-11-10 10:00:00'), -- Huyền Trang
-- (75, 18, 25, 'COMMENT', '2025-11-10 11:00:00'); -- Vy (User Reply)

TRUNCATE TABLE FEEDBACK;

INSERT INTO FEEDBACK (fbID, userID, locID, feedbackType, fbDateTime) VALUES
-- Loc 1: InterContinental (Res 1: Tourist 16, checkout: 2025-10-12 12:00)
(1, 16, 1, 'REVIEW', '2025-10-13 10:00:00'), -- Lộc ✅
(2, 6, 1, 'COMMENT', '2025-10-13 11:00:00'), -- Owner reply
(3, 17, 1, 'COMMENT', '2025-10-14 09:00:00'), -- User reply

-- Loc 2: Metropole (Res 9: Tourist 23, checkout: 2025-11-08; Res 29: Tourist 29, checkout: 2025-11-04)
(4, 23, 2, 'REVIEW', '2025-11-09 14:00:00'), -- Sophie ✅
(5, 8, 2, 'COMMENT', '2025-11-09 15:00:00'), -- Owner reply
(6, 29, 2, 'REVIEW', '2025-11-05 08:00:00'), -- Anh Tuấn ✅

-- Loc 3: Vinpearl (Res 4: Tourist 18, checkout: 2025-10-18)
(7, 18, 3, 'REVIEW', '2025-10-19 09:00:00'), -- Vy ✅
(8, 7, 3, 'COMMENT', '2025-10-19 10:00:00'), -- Owner reply

-- Loc 5: Reverie (Res 8: Tourist 22, checkout: 2025-11-03)
(9, 22, 5, 'REVIEW', '2025-11-04 10:00:00'), -- David Teo ✅
(10, 7, 5, 'COMMENT', '2025-11-04 11:00:00'), -- Owner reply

-- Loc 11: Anan Saigon (Res 3: Tourist 17, checkout: 2025-01-08; Res 18: Tourist 22, checkout: 2025-11-10)
(11, 17, 11, 'REVIEW', '2025-01-09 10:00:00'), -- Thông ✅
(12, 9, 11, 'COMMENT', '2025-01-09 11:00:00'), -- Owner reply
(13, 22, 11, 'REVIEW', '2025-11-11 10:00:00'), -- David Teo ✅

-- Loc 12: Quán Ăn Ngon (Res 11: Tourist 25, checkout: 2025-11-05)
(14, 25, 12, 'REVIEW', '2025-11-06 10:00:00'), -- Mai Anh ✅
(15, 10, 12, 'COMMENT', '2025-11-06 11:00:00'), -- Owner reply
-- Tourist 17 @ Loc 12 removed: Res 13 is CONFIRMED not COMPLETED

-- Loc 13: Bún Chả (Res 20: Tourist 24, checkout: 2025-11-10 13:00)
(16, 24, 13, 'REVIEW', '2025-11-11 10:00:00'), -- Trần Quảng ✅
(17, 9, 13, 'COMMENT', '2025-11-11 11:00:00'), -- Owner reply

-- Loc 14: Pizza 4P's (Res 23: Tourist 17, checkout: 2025-11-12)
(18, 17, 14, 'REVIEW', '2025-11-13 10:00:00'), -- Thông ✅
(19, 11, 14, 'COMMENT', '2025-11-13 11:00:00'), -- Owner reply

-- Loc 21: Bà Nà Hills (Res 12: Tourist 16, checkout: 2025-11-06 17:00)
(20, 16, 21, 'REVIEW', '2025-11-07 10:00:00'), -- Lộc ✅
(21, 6, 21, 'COMMENT', '2025-11-07 11:00:00'), -- Owner reply

-- Loc 22: Hội An (Res 6: Tourist 20, checkout: 2025-10-25 17:00)
(22, 20, 22, 'REVIEW', '2025-10-26 10:00:00'), -- Minh Tuấn ✅
(23, 10, 22, 'COMMENT', '2025-10-26 11:00:00'), -- Owner reply

-- Loc 23: Hạ Long (Res 7: Tourist 21, checkout: 2025-10-28; Res 27: Tourist 27, checkout: 2025-10-22)
(24, 21, 23, 'REVIEW', '2025-10-29 10:00:00'), -- Anh Đào ✅
(25, 7, 23, 'COMMENT', '2025-10-29 11:00:00'), -- Owner reply
(26, 27, 23, 'REVIEW', '2025-10-23 10:00:00'), -- Kenji ✅

-- Loc 24: Bảo tàng (Res 16: Tourist 20, checkout: 2025-10-26; Res 19: Tourist 23, checkout: 2025-11-10)
(27, 20, 24, 'REVIEW', '2025-10-27 10:00:00'), -- Minh Tuấn ✅
(28, 7, 24, 'COMMENT', '2025-10-27 11:00:00'), -- Owner reply
(29, 23, 24, 'REVIEW', '2025-11-11 10:00:00'); -- Sophie ✅

-- 30. REVIEW (40 Dòng)
-- (Liên kết với 40 FEEDBACK có type 'REVIEW')
TRUNCATE TABLE REVIEW;
INSERT INTO REVIEW (reviewID, ratingPoints) VALUES
(1, 5), (4, 5), (5, 4), -- Loc 1
(6, 5), (8, 5), (9, 4), -- Loc 2
(11, 4), (13, 5), (14, 4), -- Loc 3
(16, 5), (18, 5), (19, 5), -- Loc 4
(21, 5), (23, 5), (24, 4), -- Loc 5
(26, 5), (28, 5), (30, 4), -- Loc 11
(31, 4), (33, 5), (34, 4), -- Loc 12
(36, 5), (38, 4), (39, 5), -- Loc 13
(41, 5), (43, 4), (44, 5), -- Loc 14
(46, 4), (48, 5), (49, 4), -- Loc 15
(51, 5), (53, 4), (54, 3), -- Loc 21
(56, 5), (58, 4), (59, 5), -- Loc 22
(61, 5), (63, 4), (64, 4), -- Loc 23
(66, 4), (68, 5), (69, 3), -- Loc 24
(71, 5), (73, 4), (74, 5); -- Loc 25

-- 31. TOURIST_HAS_PREFERENCE (50 Dòng)
-- (Sở thích ban đầu khi đăng ký)
TRUNCATE TABLE TOURIST_HAS_PREFERENCE;
INSERT INTO TOURIST_HAS_PREFERENCE (touristID, prefID) VALUES
(16, 1), (16, 3), (16, 9), (16, 28), (16, 14), -- Lộc
(17, 8), (17, 11), (17, 13), (17, 21), (17, 26), -- Thông
(18, 5), (18, 10), (18, 18), (18, 25), (18, 1), -- Vy
(19, 1), (19, 10), (19, 20), (19, 13), -- Bích Phương
(20, 12), (20, 11), (20, 2), (20, 22), -- Minh Tuấn
(21, 15), (21, 23), (21, 18), (21, 2), -- Anh Đào
(22, 3), (22, 8), (22, 13), (22, 20), (22, 14), -- David Teo
(23, 6), (23, 12), (23, 22), (23, 21), (23, 10), -- Sophie
(24, 1), (24, 28), (24, 4), (24, 26), -- Trần Quảng
(25, 8), (25, 26), (25, 5), (25, 13), -- Mai Anh
(26, 9), (26, 20), (26, 14), (26, 1), -- John Doe
(27, 11), (27, 12), (27, 19), (27, 8), -- Kenji
(28, 13), (28, 20), (28, 5), (28, 18), -- Min-jun
(29, 12), (29, 11), (29, 3), (29, 5), -- Anh Tuấn
(30, 1), (30, 15), (30, 20), (30, 9); -- Thùy Linh

SET FOREIGN_KEY_CHECKS=1; -- Bật lại kiểm tra khóa ngoại
/*
================================================================
 PHẦN 1.2: CHÈN DỮ LIỆU MẪU (PHẦN 3/3 - 4 BẢNG CUỐI)
 
 GHI CHÚ: Dữ liệu này phụ thuộc vào 30 bảng đã chèn ở Phần 1 & 2.
================================================================
*/

USE VIVUVIET;

SET FOREIGN_KEY_CHECKS=0; -- Tắt kiểm tra khóa ngoại để chèn dữ liệu

/* ================================================================
 BẢNG LEVEL 5 (FEEDBACK RELATIONS)
================================================================
*/

-- 32. COMMENT (35 Dòng)
-- (Liên kết với 35 FEEDBACK có type 'COMMENT' - fbID từ 2, 3, 7, 10, ...)
TRUNCATE TABLE COMMENT;
INSERT INTO COMMENT (commentID, role, content) VALUES
(2, 'OWNER_REPLY', 'Cảm ơn anh Lộc đã tin tưởng InterContinental Danang. Rất vinh dự khi được phục vụ anh trong dịp đặc biệt. Hẹn gặp lại anh!'),
(3, 'USER_REPLY', 'Chỗ này đẹp thật sự, view từ phòng anh Lộc chụp xịn quá. Mình cũng muốn đi.'),
(7, 'OWNER_REPLY', 'Thank you for your kind words, Ms. Sophie! We are delighted you enjoyed the historical ambiance of Metropole.'),
(10, 'ADMIN_REPLY', 'Cảm ơn đóng góp của anh Tuấn. BQT đã ghi nhận và sẽ làm việc với đối tác về vấn đề an ninh tại khu vực này.'),
(12, 'OWNER_REPLY', 'Cảm ơn gia đình chị Vy đã chọn Vinpearl. Rất vui vì bé nhà mình đã có trải nghiệm vui vẻ!'),
(15, 'USER_REPLY', 'Bạn ơi, Vinpearl này có gần VinWonders không? Mình đang tính đặt phòng.'),
(17, 'OWNER_REPLY', 'Cảm ơn chị Anh Đào. Topas rất vui vì chị đã có những giây phút thư giãn tuyệt vời giữa thiên nhiên.'),
(20, 'USER_REPLY', 'Mình cũng vừa ở đây, công nhận là đẹp nhưng đường lên hơi khó đi, mọi người nên đặt xe đưa đón của resort.'),
(22, 'OWNER_REPLY', 'Thank you, Mr. David. The Reverie Saigon team is thrilled to have provided you with a memorable luxury experience.'),
(25, 'USER_REPLY', 'Thiết kế nội thất quá lộng lẫy, đúng là đẳng cấp 6 sao.'),
(27, 'OWNER_REPLY', 'Cảm ơn anh Thông. Anan Saigon rất vui khi được phục vụ anh. Món phở 100$ là tâm huyết của Chef Peter.'),
(29, 'USER_REPLY', 'Phở 100$ ăn vị thế nào vậy bạn? Có đáng tiền không?'),
(32, 'OWNER_REPLY', 'Cảm ơn chị Mai Anh đã ghé Quán Ăn Ngon. Rất mong được phục vụ gia đình chị lần sau!'),
(35, 'USER_REPLY', 'Quán này cuối tuần đông không bạn? Mình định rủ gia đình đi ăn.'),
(37, 'OWNER_REPLY', 'Cảm ơn anh Quảng. Bún chả Hương Liên luôn giữ gìn hương vị truyền thống Hà Nội.'),
(40, 'USER_REPLY', 'Quán này có phải quán Obama ăn không nhỉ? Nhìn quen quen.'),
(42, 'OWNER_REPLY', 'Cảm ơn anh Thông, Pizza 4P''s rất vui khi anh hài lòng với pizza Burrata. Hẹn gặp lại anh!'),
(45, 'USER_REPLY', 'Mình cũng thích pizza ở đây, phô mai béo ngậy ăn đã miệng gì đâu.'),
(47, 'OWNER_REPLY', 'Cảm ơn anh Quảng đã ghé Morning Glory. Các món ăn luôn được chúng tôi chăm chút.'),
(50, 'USER_REPLY', 'Cao lầu ở đây ăn ổn không mọi người?'),
(52, 'OWNER_REPLY', 'Cảm ơn anh Lộc, Cầu Vàng luôn là điểm nhấn tự hào của Bà Nà Hills. Rất vui vì anh đã có trải nghiệm buffet tốt!'),
(55, 'USER_REPLY', 'Mình đi cuối tuần đông quá, chờ cáp treo hơi lâu. Mọi người nên đi ngày thường.'),
(57, 'OWNER_REPLY', 'Cảm ơn anh Tuấn, Hội An luôn đẹp phải không ạ! Hẹn gặp lại anh.'),
(60, 'USER_REPLY', 'Đúng rồi, nên đi buổi tối thả đèn hoa đăng là lãng mạn nhất.'),
(62, 'OWNER_REPLY', 'Cảm ơn chị Anh Đào đã lựa chọn du thuyền Vịnh Hạ Long. Chúc chị có nhiều chuyến đi vui vẻ!'),
(65, 'USER_REPLY', 'Tàu 4 tiếng đi có mệt không bạn, mình say sóng.'),
(67, 'OWNER_REPLY', 'Cảm ơn anh Tuấn đã ghé thăm Bảo tàng. Chúng tôi luôn cố gắng truyền tải thông điệp hòa bình.'),
(70, 'ADMIN_REPLY', 'Cảm ơn thông tin của bạn. BQT sẽ xem xét lại các mô tả, hình ảnh để tránh gây hiểu lầm.'),
(72, 'OWNER_REPLY', 'Cảm ơn chị Maria. Địa đạo Củ Chi là một chứng nhân lịch sử quan trọng của Việt Nam.'),
(75, 'USER_REPLY', 'Mình đi rồi, trải nghiệm chui hầm rất đáng nhớ. Nên thử nhé mọi người.');

-- 33. COMMENTS_TO (15 Dòng)
-- (Liên kết comment với parent review hoặc parent comment)
TRUNCATE TABLE COMMENTS_TO;
INSERT INTO COMMENTS_TO (commentID, parentID) VALUES
(3, 1),   -- (User fbID=3) trả lời (Review fbID=1) của Lộc
(2, 1),   -- (Owner fbID=2) trả lời (Review fbID=1) của Lộc
(7, 6),   -- (Owner fbID=7) trả lời (Review fbID=6) của Sophie
(10, 9),  -- (Admin fbID=10) trả lời (Review fbID=9) của Minh Tuấn
(12, 11), -- (Owner fbID=12) trả lời (Review fbID=11) của Vy
(15, 11), -- (User fbID=15) trả lời (Review fbID=11) của Vy
(17, 16), -- (Owner fbID=17) trả lời (Review fbID=16) của Anh Đào
(20, 16), -- (User fbID=20) trả lời (Review fbID=16) của Anh Đào
(27, 26), -- (Owner fbID=27) trả lời (Review fbID=26) của Thông
(29, 26), -- (User fbID=29) trả lời (Review fbID=26) của Thông
(32, 31), -- (Owner fbID=32) trả lời (Review fbID=31) của Mai Anh
(35, 31), -- (User fbID=35) trả lời (Review fbID=31) của Mai Anh
(52, 51), -- (Owner fbID=52) trả lời (Review fbID=51) của Lộc
(55, 51), -- (User fbID=55) trả lời (Review fbID=51) của Lộc
(60, 56); -- (User fbID=60) trả lời (Review fbID=56) của Minh Tuấn

-- 34. FB_LIKES (50 Dòng)
-- (userID từ 16-35, fbID từ 1-75)
TRUNCATE TABLE FB_LIKES;
INSERT INTO FB_LIKES (userID, fbID) VALUES
(17, 1), (18, 1), (19, 1), (20, 1), (21, 1), (22, 1), (23, 1), -- 7 likes cho Review (1) của Lộc
(16, 26), (18, 26), (22, 26), (23, 26), (29, 26), -- 5 likes cho Review (26) của Thông
(16, 11), (17, 11), (19, 11), -- 3 likes cho Review (11) của Vy
(16, 56), (17, 56), (18, 56), (19, 56), (21, 56), (22, 56), (23, 56), (24, 56), (25, 56), -- 9 likes cho Review (56) của Minh Tuấn
(18, 61), (19, 61), (20, 61), -- 3 likes cho Review (61) của Anh Đào
(16, 6), (18, 6), (20, 6), (22, 6), -- 4 likes cho Review (6) của Sophie
(17, 21), (18, 21), (19, 21), (23, 21), (24, 21), -- 5 likes cho Review (21) của David
(16, 3), (17, 3), (18, 3), -- 3 likes cho Comment (3)
(16, 29), (18, 29), (19, 29), (20, 29), -- 4 likes cho Comment (29)
(16, 55), (17, 55), (18, 55), (19, 55), (20, 55), (21, 55), -- 6 likes cho Comment (55)
(26, 1), (27, 1), (28, 4), (29, 6), (30, 11), (31, 14), (32, 21), (33, 26), (34, 31), (35, 33);

-- 35. FB_HAS_IMAGE (10 Dòng)
-- (Liên kết Feedback với Image)
TRUNCATE TABLE FB_HAS_IMAGE;
INSERT INTO FB_HAS_IMAGE (fbID, imageID) VALUES
(1, 30), -- Review (1) của Lộc có 1 ảnh
(1, 31), -- Review (1) của Lộc có ảnh thứ 2
(26, 32), -- Review (26) của Thông có 1 ảnh
(11, 30), -- Review (11) của Vy có 1 ảnh
(56, 31), -- Review (56) của Minh Tuấn có 1 ảnh
(56, 32), -- Review (56) của Minh Tuấn có ảnh thứ 2
(61, 30), -- Review (61) của Anh Đào có 1 ảnh
(21, 31), -- Review (21) của David có 1 ảnh
(51, 30), -- Review (51) của Lộc có 1 ảnh
(68, 32); -- Review (68) của Sophie có 1 ảnh

SET FOREIGN_KEY_CHECKS=1; -- Bật lại kiểm tra khóa ngoại


