/*
================================================================
 VOUCHER STATUS VIEW - MySQL Compatible Solution
================================================================
 Since MySQL doesn't allow CURDATE() in generated columns,
 we use a VIEW to calculate voucher status dynamically.
================================================================
*/

USE VIVUVIET;

-- Create view for voucher status
DROP VIEW IF EXISTS vw_voucher_status;

CREATE VIEW vw_voucher_status AS
SELECT 
    V.*,
    CASE 
        WHEN CURDATE() < V.startDate THEN 'UPCOMING'
        WHEN CURDATE() > V.expDate THEN 'EXPIRED'
        WHEN V.remaining_slots <= 0 THEN 'SOLDOUT'
        ELSE 'ACTIVE'
    END AS status
FROM VOUCHER V;

-- Usage: Instead of "SELECT * FROM VOUCHER", use "SELECT * FROM vw_voucher_status"
-- This view includes all voucher columns PLUS the calculated status column
