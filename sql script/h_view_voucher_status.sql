/*
================================================================
 VIEW: VOUCHER WITH COMPUTED STATUS
 - Tự động tính status dựa trên startDate, expDate, remaining_slots
 - Không cần cột status trong bảng VOUCHER
================================================================
*/

USE VIVUVIET;

DROP VIEW IF EXISTS vw_voucher_status;

CREATE VIEW vw_voucher_status AS
SELECT 
    v.voucherID,
    v.rankRequirement,
    v.limitVal,
    v.discountPercentage,
    v.slots,
    v.used_slots,
    v.remaining_slots,
    v.voucherDescription,
    v.startDate,
    v.expDate,
    -- Computed status column
    CASE 
        WHEN CURDATE() < v.startDate THEN 'UPCOMING'
        WHEN CURDATE() > v.expDate THEN 'EXPIRED'
        WHEN v.remaining_slots <= 0 THEN 'SOLDOUT'
        ELSE 'ACTIVE'
    END AS status
FROM VOUCHER v;

-- Test query
SELECT * FROM vw_voucher_status 
ORDER BY 
    CASE status
        WHEN 'ACTIVE' THEN 1
        WHEN 'UPCOMING' THEN 2
        WHEN 'SOLDOUT' THEN 3
        WHEN 'EXPIRED' THEN 4
    END,
    voucherID;

SELECT 'View vw_voucher_status created successfully!' as message;
