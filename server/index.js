/*
================================================================
 SERVER VIVUVIET - BTL2 WITH REAL DATABASE INTEGRATION
 - Login với USER_ACCOUNT table
 - Filter locations theo ownerID
 - Reviews/Comments từ FEEDBACK table
 - NEW: Location Images & Utilities Management
================================================================
*/

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Database config
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'pass',
    database: 'VIVUVIET',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
};

let pool;
try {
    pool = mysql.createPool(dbConfig);
    console.log('✅ MySQL Pool created successfully');
} catch (error) {
    console.error('❌ Cannot create MySQL Pool:', error.message);
    process.exit(1);
}

const apiRouter = express.Router();

// ==================================================================
// HEALTH CHECK
// ==================================================================
apiRouter.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', message: 'VivuViet API Ready', timestamp: new Date().toISOString() });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ==================================================================
// AUTH - LOGIN (Link với USER_ACCOUNT table)
// ==================================================================
apiRouter.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query từ USER_ACCOUNT
        const [users] = await pool.query(
            'SELECT userID, mail, fullName, role FROM USER_ACCOUNT WHERE mail = ? AND password = ?',
            [email, password]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        const user = users[0];

        // Nếu là OWNER, lấy BOID
        if (user.role === 'OWNER') {
            const [owners] = await pool.query(
                'SELECT BOID, taxCode, auStatus FROM BUSINESS_OWNER WHERE BOID = ?',
                [user.userID]
            );

            if (owners.length > 0) {
                return res.json({
                    success: true,
                    role: 'OWNER',
                    token: 'mock-token-' + user.userID,
                    user: {
                        id: user.userID,
                        email: user.mail,
                        fullName: user.fullName,
                        BOID: owners[0].BOID,
                        auStatus: owners[0].auStatus
                    }
                });
            }
        }

        // Nếu là TOURIST hoặc ADMIN
        res.json({
            success: true,
            role: user.role,
            token: 'mock-token-' + user.userID,
            user: {
                id: user.userID,
                email: user.mail,
                fullName: user.fullName
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================================================================
// DEMO ACCOUNTS (Owner accounts từ database để test)
// ==================================================================

apiRouter.get('/demo-accounts', async (req, res) => {
    try {
        const [accounts] = await pool.query(
            `SELECT 
                u.userID,
                u.mail as email,
                u.password,
                u.fullName,
                u.role,
                b.BOID
             FROM USER_ACCOUNT u
             LEFT JOIN BUSINESS_OWNER b ON u.userID = b.BOID
             WHERE u.role = 'OWNER'
             LIMIT 5`
        );

        res.json({
            success: true,
            accounts: accounts || []
        });
    } catch (error) {
        console.error('Error fetching demo accounts:', error);
        res.status(500).json({ error: error.message });
    }
});


// ==================================================================
// LOCATION CRUD (Filter theo ownerID thật)
// ==================================================================

// Tạo location mới - USING STORED PROCEDURE
apiRouter.post('/locations', async (req, res) => {
    const { locName, street, district, province, locType, locNo, ward, priceLev, description, ownerID } = req.body;

    try {
        const realOwnerID = ownerID || req.query.ownerID;

        if (!realOwnerID) {
            return res.status(400).json({ error: 'ownerID không được để trống' });
        }

        // CALL stored procedure sp_add_location
        await pool.query(
            'CALL sp_add_location(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @newID, @success, @msg)',
            [realOwnerID, locName, locNo || null, street, ward || null, district, province, locType, description || null, priceLev || null]
        );

        // Get OUT parameters
        const [[outParams]] = await pool.query(
            'SELECT @newID as newID, @success as success, @msg as message'
        );

        if (outParams.success) {
            res.status(201).json({
                success: true,
                locID: outParams.newID,
                message: outParams.message
            });
        } else {
            res.status(400).json({ error: outParams.message });
        }
    } catch (e) {
        console.error('Error in POST /locations:', e);
        res.status(500).json({ error: 'Lỗi server: ' + e.message });
    }
});

// Cập nhật location - USING STORED PROCEDURE
apiRouter.put('/locations/:id', async (req, res) => {
    const { locName, street, district, province, description, priceLev, status } = req.body;
    const locID = req.params.id;

    try {
        // CALL stored procedure sp_update_location
        await pool.query(
            'CALL sp_update_location(?, ?, ?, ?, ?, ?, ?, ?, @success, @msg)',
            [locID, locName, street, district, province, description, priceLev, status || 'ACTIVE']
        );

        // Get OUT parameters
        const [[outParams]] = await pool.query(
            'SELECT @success as success, @msg as message'
        );

        if (outParams.success) {
            res.json({ success: true, message: outParams.message });
        } else {
            res.status(400).json({ error: outParams.message });
        }
    } catch (e) {
    });

// ==================================================================
// OWNER STATISTICS
// ==================================================================
apiRouter.get('/owner/statistics', async (req, res) => {
    const { ownerID } = req.query;

    try {
        if (!ownerID) {
            return res.status(400).json({ error: 'ownerID không được để trống' });
        }

        const [statistics] = await pool.query(
            `SELECT 
                l.locID,
                l.locName,
                l.locType,
                l.ratingPoints,
                COUNT(DISTINCT f.fbID) as totalReviews,
                COALESCE(AVG(r.ratingPoints), 0) as avgRating
             FROM LOCATION l
             LEFT JOIN FEEDBACK f ON l.locID = f.locID AND f.feedbackType = 'REVIEW'
             LEFT JOIN REVIEW r ON f.fbID = r.reviewID
             WHERE l.ownerID = ?
             GROUP BY l.locID
             ORDER BY l.locID DESC`,
            [ownerID]
        );

        res.json({ success: true, statistics });
    } catch (e) {
        console.error('Error in GET /owner/statistics:', e);
        res.status(500).json({ error: e.message });
    }
});

// ==================================================================
// REVIEWS & COMMENTS (Từ FEEDBACK table)
// ==================================================================
apiRouter.get('/owner/notifications', async (req, res) => {
    const { ownerID } = req.query;

    try {
        if (!ownerID) {
            return res.status(400).json({ error: 'ownerID không được để trống' });
        }

        // Lấy reviews và comments cho tất cả locations của owner
        const [notifications] = await pool.query(
            `SELECT 
                f.fbID,
                f.fbDateTime,
                f.feedbackType,
                f.likeCount,
                l.locID,
                l.locName,
                u.userID,
                u.fullName as userName,
                u.mail as userEmail,
                CASE 
                    WHEN f.feedbackType = 'REVIEW' THEN r.ratingPoints
                    ELSE NULL
                END as rating,
                CASE 
                    WHEN f.feedbackType = 'REVIEW' THEN NULL
                    WHEN f.feedbackType = 'COMMENT' THEN c.content
                    ELSE NULL
                END as content
             FROM FEEDBACK f
             INNER JOIN LOCATION l ON f.locID = l.locID
             INNER JOIN USER_ACCOUNT u ON f.userID = u.userID
             LEFT JOIN REVIEW r ON f.fbID = r.reviewID
             LEFT JOIN COMMENT c ON f.fbID = c.commentID
             WHERE l.ownerID = ?
             ORDER BY f.fbDateTime DESC
             LIMIT 100`,
            [ownerID]
        );

        res.json({ success: true, notifications });
    } catch (e) {
        console.error('Error in GET /owner/notifications:', e);
        res.status(500).json({ error: e.message });
    }
});


// ==================================================================
// LOCATION IMAGES MANAGEMENT (NEW)
// ==================================================================

// GET all images for a location
apiRouter.get('/locations/:locID/images', async (req, res) => {
    const { locID } = req.params;

    try {
        const [images] = await pool.query(
            `SELECT i.imageID, i.URL, i.caption, i.imageType
             FROM IMAGE i
             INNER JOIN LOC_HAS_IMAGE lhi ON i.imageID = lhi.imageID
             WHERE lhi.locID = ?
             ORDER BY i.imageID DESC`,
            [locID]
        );

        res.json({ success: true, images });
    } catch (error) {
        console.error('Error fetching location images:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST add image to location
apiRouter.post('/locations/:locID/images', async (req, res) => {
    const { locID } = req.params;
    const { URL, caption, imageType } = req.body;

    try {
        // Insert into IMAGE table
        const [imageResult] = await pool.query(
            `INSERT INTO IMAGE (URL, caption, imageType) VALUES (?, ?, ?)`,
            [URL, caption || null, imageType || 'LOCATION_GALLERY']
        );

        const imageID = imageResult.insertId;

        // Link to location
        await pool.query(
            `INSERT INTO LOC_HAS_IMAGE (locID, imageID) VALUES (?, ?)`,
            [locID, imageID]
        );

        res.status(201).json({
            success: true,
            imageID,
            message: 'Thêm hình ảnh thành công'
        });
    } catch (error) {
        console.error('Error adding location image:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE remove image from location
apiRouter.delete('/locations/:locID/images/:imageID', async (req, res) => {
    const { locID, imageID } = req.params;

    try {
        // Delete from LOC_HAS_IMAGE
        await pool.query(
            `DELETE FROM LOC_HAS_IMAGE WHERE locID = ? AND imageID = ?`,
            [locID, imageID]
        );

        // Optionally delete from IMAGE table if not used elsewhere
        await pool.query(
            `DELETE FROM IMAGE WHERE imageID = ? 
             AND NOT EXISTS (SELECT 1 FROM LOC_HAS_IMAGE WHERE imageID = ?)
             AND NOT EXISTS (SELECT 1 FROM UTILITY_HAS_IMAGE WHERE imageID = ?)
             AND NOT EXISTS (SELECT 1 FROM FB_HAS_IMAGE WHERE imageID = ?)`,
            [imageID, imageID, imageID, imageID]
        );

        res.json({ success: true, message: 'Xóa hình ảnh thành công' });
    } catch (error) {
        console.error('Error deleting location image:', error);
        res.status(500).json({ error: error.message });
    }
});


// ==================================================================
// LOCATION UTILITIES MANAGEMENT (NEW)
// ==================================================================

// GET all utilities for a location
apiRouter.get('/locations/:locID/utilities', async (req, res) => {
    const { locID } = req.params;

    try {
        const [utilities] = await pool.query(
            `SELECT u.utility, u.uName, u.uType, u.UDescription
             FROM UTILITY u
             INNER JOIN LOC_HAS_UTILITY lhu ON u.utility = lhu.utility
             WHERE lhu.locID = ?
             ORDER BY u.uName`,
            [locID]
        );

        // Get images for each utility
        for (let util of utilities) {
            const [images] = await pool.query(
                `SELECT i.imageID, i.URL, i.caption
                 FROM IMAGE i
                 INNER JOIN UTILITY_HAS_IMAGE uhi ON i.imageID = uhi.imageID
                 WHERE uhi.utility = ?`,
                [util.utility]
            );
            util.images = images;
        }

        res.json({ success: true, utilities });
    } catch (error) {
        console.error('Error fetching location utilities:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST add utility to location
apiRouter.post('/locations/:locID/utilities', async (req, res) => {
    const { locID } = req.params;
    const { uName, uType, UDescription } = req.body;

    try {
        // Check if utility already exists
        const [existing] = await pool.query(
            `SELECT utility FROM UTILITY WHERE uName = ?`,
            [uName]
        );

        let utilityID;

        if (existing.length > 0) {
            utilityID = existing[0].utility;
        } else {
            // Create new utility
            const [result] = await pool.query(
                `INSERT INTO UTILITY (uName, uType, UDescription) VALUES (?, ?, ?)`,
                [uName, uType || null, UDescription || null]
            );
            utilityID = result.insertId;
        }

        // Link to location
        await pool.query(
            `INSERT IGNORE INTO LOC_HAS_UTILITY (utility, locID) VALUES (?, ?)`,
            [utilityID, locID]
        );

        res.status(201).json({
            success: true,
            utilityID,
            message: 'Thêm tiện ích thành công'
        });
    } catch (error) {
        console.error('Error adding utility:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT update utility
apiRouter.put('/utilities/:utilityID', async (req, res) => {
    const { utilityID } = req.params;
    const { uName, uType, UDescription } = req.body;

    try {
        await pool.query(
            `UPDATE UTILITY 
             SET uName = COALESCE(?, uName),
                 uType = COALESCE(?, uType),
                 UDescription = COALESCE(?, UDescription)
             WHERE utility = ?`,
            [uName, uType, UDescription, utilityID]
        );

        res.json({ success: true, message: 'Cập nhật tiện ích thành công' });
    } catch (error) {
        console.error('Error updating utility:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE remove utility from location
apiRouter.delete('/locations/:locID/utilities/:utilityID', async (req, res) => {
    const { locID, utilityID } = req.params;

    try {
        await pool.query(
            `DELETE FROM LOC_HAS_UTILITY WHERE locID = ? AND utility = ?`,
            [locID, utilityID]
        );

        res.json({ success: true, message: 'Xóa tiện ích thành công' });
    } catch (error) {
        console.error('Error removing utility:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST add image to utility
apiRouter.post('/utilities/:utilityID/images', async (req, res) => {
    const { utilityID } = req.params;
    const { URL, caption } = req.body;

    try {
        // Insert into IMAGE table
        const [imageResult] = await pool.query(
            `INSERT INTO IMAGE (URL, caption, imageType) VALUES (?, ?, 'UTILITY')`,
            [URL, caption || null]
        );

        const imageID = imageResult.insertId;

        // Link to utility
        await pool.query(
            `INSERT INTO UTILITY_HAS_IMAGE (utility, imageID) VALUES (?, ?)`,
            [utilityID, imageID]
        );

        res.status(201).json({
            success: true,
            imageID,
            message: 'Thêm hình ảnh tiện ích thành công'
        });
    } catch (error) {
        console.error('Error adding utility image:', error);
        res.status(500).json({ error: error.message });
    }
});


// Mount API router
app.use('/make-server-aef03c12', apiRouter);

// Start server
app.listen(port, () => {
    console.log('\n========================================');
    console.log(`📗 Database: VIVUVIET`);
    console.log(`🚀 Server: http://localhost:${port}/make-server-aef03c12`);
    console.log('========================================\n');
    console.log('✅ Endpoints:');
    console.log('   POST   /auth/login');
    console.log('   GET    /demo-accounts');
    console.log('   POST   /locations');
    console.log('   PUT    /locations/:id');
    console.log('   DELETE /locations/:id');
    console.log('   GET    /owner/locations?ownerID=X');
    console.log('   GET    /owner/statistics?ownerID=X');
    console.log('   GET    /owner/notifications?ownerID=X');
    console.log('\n📸 NEW - Location Images:');
    console.log('   GET    /locations/:locID/images');
    console.log('   POST   /locations/:locID/images');
    console.log('   DELETE /locations/:locID/images/:imageID');
    console.log('\n🛠️  NEW - Location Utilities:');
    console.log('   GET    /locations/:locID/utilities');
    console.log('   POST   /locations/:locID/utilities');
    console.log('   PUT    /utilities/:utilityID');
    console.log('   DELETE /locations/:locID/utilities/:utilityID');
    console.log('   POST   /utilities/:utilityID/images');
    console.log('========================================\n');
});
