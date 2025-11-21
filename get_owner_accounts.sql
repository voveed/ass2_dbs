-- Lấy tất cả owner accounts để test
SELECT 
    u.userID,
    u.mail as email,
    u.password,
    u.fullName,
    b.BOID,
    b.taxCode,
    b.auStatus,
    (SELECT COUNT(*) FROM LOCATION WHERE ownerID = b.BOID) as totalLocations
FROM USER_ACCOUNT u
JOIN BUSINESS_OWNER b ON u.userID = b.BOID
WHERE u.role = 'OWNER'
ORDER BY u.userID
LIMIT 5;
