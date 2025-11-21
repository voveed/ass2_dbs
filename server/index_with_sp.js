/*
================================================================
 SERVER VIVUVIET - BTL2 WITH STORED PROCEDURES
 - Backend CHỈ CALL stored procedures từ database
 - KHÔNG viết business logic vào code
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
    password: 's',
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
// AUTH - LOGIN
// ==================================================================
apiRouter.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.query(
            'SELECT userID, mail, fullName, role FROM USER_ACCOUNT WHERE mail = ? AND password = ?',
            [email, password]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        const user = users[0];

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
// DEMO ACCOUNTS
// ==================================================================
apiRouter.get('/demo-accounts', async (req, res) => {
    try {
        const [accounts] = await pool.query(
            `SELECT u.userID, u.mail as email, u.password, u.fullName, u.role, b.BOID
             FROM USER_ACCOUNT u
             LEFT JOIN BUSINESS_OWNER b ON u.userID = b.BOID
             WHERE u.role = 'OWNER'
             LIMIT 5`
        );

        res.json({ success: true, accounts: accounts || [] });
    } catch (error) {
        console.error('Error fetching demo accounts:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================================================================
// LOCATION CRUD - CALLS STORED PROCEDURES
// ==================================================================

apiRouter.post('/locations', async (req, res) => {
    const { locName, street, district, province, locType, locNo, ward, priceLev, description, ownerID } = req.body;

    try {
        const realOwnerID = ownerID || req.query.ownerID;
        if (!realOwnerID) {
            return res.status(400).json({ error: 'ownerID không được để trống' });
        }

        await pool.query(
            'CALL sp_add_location(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @newID, @success, @msg)',
            [realOwnerID, locName, locNo || null, street, ward || null, district, province, locType, description || null, priceLev || null]
        );

        const [[outParams]] = await pool.query('SELECT @newID as newID, @success as success, @msg as message');

        if (outParams.success) {
            res.status(201).json({ success: true, locID: outParams.newID, message: outParams.message });
        } else {
            res.status(400).json({ error: outParams.message });
        }
    } catch (e) {
        console.error('Error in POST /locations:', e);
        res.status(500).json({ error: 'Lỗi server: ' + e.message });
    }
});

apiRouter.put('/locations/:id', async (req, res) => {
    const { locName, street, district, province, description, priceLev, status } = req.body;
    const locID = req.params.id;

    try {
        await pool.query(
            'CALL sp_update_location(?, ?, ?, ?, ?, ?, ?, ?, @success, @msg)',
            [locID, locName, street, district, province, description, priceLev, status || 'ACTIVE']
        );

        const [[outParams]] = await pool.query('SELECT @success as success, @msg as message');

        if (outParams.success) {
            res.json({ success: true, message: outParams.message });
        } else {
            res.status(400).json({ error: outParams.message });
        }
    } catch (e) {
        console.error('Error in PUT /locations:', e);
        res.status(500).json({ error: e.message });
    }
});

apiRouter.delete('/locations/:id', async (req, res) => {
    const locID = req.params.id;
    const { ownerID } = req.query;

    try {
        if (!ownerID) {
            return res.status(400).json({ error: 'ownerID required for security' });
        }

        await pool.query('CALL sp_delete_location(?, ?, @success, @msg)', [locID, ownerID]);
        const [[outParams]] = await pool.query('SELECT @success as success, @msg as message');

        if (outParams.success) {
            res.json({ success: true, message: outParams.message });
        } else {
            res.status(400).json({ error: outParams.message });
        }
    } catch (e) {
        console.error('Error in DELETE /locations:', e);
        res.status(500).json({ error: e.message });
    }
});

apiRouter.get('/owner/locations', async (req, res) => {
    const { ownerID, search, locType, status, sortBy } = req.query;

    try {
        if (!ownerID) {
            return res.status(400).json({ error: 'ownerID không được để trống' });
        }

        const [results] = await pool.query(
            'CALL sp_get_locations_by_owner(?, ?, ?, ?, ?)',
            [
                ownerID,
                search || null,
                locType && locType !== 'ALL' ? locType : null,
                status && status !== 'ALL' ? status : null,
                sortBy || 'name'
            ]
        );

        const locations = results[0];
        res.json({ success: true, locations });
    } catch (e) {
        console.error('Error in GET /owner/locations:', e);
        res.status(500).json({ error: e.message });
    }
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

        const [results] = await pool.query('CALL sp_get_owner_statistics(?)', [ownerID]);
        const statistics = results[0];
        res.json({ success: true, statistics });
    } catch (e) {
        console.error('Error in GET /owner/statistics:', e);
        res.status(500).json({ error: e.message });
    }
});

// ==================================================================
// REVIEWS & COMMENTS (NOTIFICATIONS)
// ==================================================================
apiRouter.get('/owner/notifications', async (req, res) => {
    const { ownerID } = req.query;

    try {
        if (!ownerID) {
            return res.status(400).json({ error: 'ownerID không được để trống' });
        }

        const [notifications] = await pool.query(
            `SELECT f.fbID, f.fbDateTime, f.feedbackType, f.likeCount, l.locID, l.locName,
                    u.userID, u.fullName as userName, u.mail as userEmail,
                    CASE WHEN f.feedbackType = 'REVIEW' THEN r.ratingPoints ELSE NULL END as rating,
                    CASE WHEN f.feedbackType = 'REVIEW' THEN NULL
                         WHEN f.feedbackType = 'COMMENT' THEN c.content ELSE NULL END as content
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
// LOCATION IMAGES
// ==================================================================
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

apiRouter.post('/locations/:locID/images', async (req, res) => {
    const { locID } = req.params;
    const { URL, caption, imageType } = req.body;

    try {
        const [imageResult] = await pool.query(
            `INSERT INTO IMAGE (URL, caption, imageType) VALUES (?, ?, ?)`,
            [URL, caption || null, imageType || 'LOCATION_GALLERY']
        );

        const imageID = imageResult.insertId;

        await pool.query(
            `INSERT INTO LOC_HAS_IMAGE (locID, imageID) VALUES (?, ?)`,
            [locID, imageID]
        );

        res.status(201).json({ success: true, imageID, message: 'Thêm hình ảnh thành công' });
    } catch (error) {
        console.error('Error adding location image:', error);
        res.status(500).json({ error: error.message });
    }
});

apiRouter.put('/images/:imageID', async (req, res) => {
    const { imageID } = req.params;
    const { caption } = req.body;

    try {
        await pool.query('CALL sp_update_image_caption(?, ?, @success, @msg)', [imageID, caption]);
        const [[outParams]] = await pool.query('SELECT @success as success, @msg as message');

        if (outParams.success) {
            res.json({ success: true, message: outParams.message });
        } else {
            res.status(400).json({ error: outParams.message });
        }
    } catch (error) {
        console.error('Error updating image caption:', error);
        res.status(500).json({ error: error.message });
    }
});

apiRouter.delete('/locations/:locID/images/:imageID', async (req, res) => {
    const { locID, imageID } = req.params;

    try {
        await pool.query(`DELETE FROM LOC_HAS_IMAGE WHERE locID = ? AND imageID = ?`, [locID, imageID]);

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
// LOCATION UTILITIES
// ==================================================================
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

        res.json({ success: true, utilities });
    } catch (error) {
        console.error('Error fetching location utilities:', error);
        res.status(500).json({ error: error.message });
    }
});

apiRouter.post('/locations/:locID/utilities', async (req, res) => {
    const { locID } = req.params;
    const { uName, uType, UDescription } = req.body;

    try {
        const [existing] = await pool.query(`SELECT utility FROM UTILITY WHERE uName = ?`, [uName]);

        let utilityID;

        if (existing.length > 0) {
            utilityID = existing[0].utility;
        } else {
            const [result] = await pool.query(
                `INSERT INTO UTILITY (uName, uType, UDescription) VALUES (?, ?, ?)`,
                [uName, uType || null, UDescription || null]
            );
            utilityID = result.insertId;
        }

        await pool.query(
            `INSERT IGNORE INTO LOC_HAS_UTILITY (utility, locID) VALUES (?, ?)`,
            [utilityID, locID]
        );

        res.status(201).json({ success: true, utilityID, message: 'Thêm tiện ích thành công' });
    } catch (error) {
        console.error('Error adding utility:', error);
        res.status(500).json({ error: error.message });
    }
});

apiRouter.put('/utilities/:utilityID', async (req, res) => {
    const { utilityID } = req.params;
    const { uName, uType, UDescription } = req.body;

    try {
        await pool.query(
            'CALL sp_update_utility(?, ?, ?, ?, @success, @msg)',
            [utilityID, uName || null, uType || null, UDescription || null]
        );
        const [[outParams]] = await pool.query('SELECT @success as success, @msg as message');

        if (outParams.success) {
            res.json({ success: true, message: outParams.message });
        } else {
            res.status(400).json({ error: outParams.message });
        }
    } catch (error) {
        console.error('Error updating utility:', error);
        res.status(500).json({ error: error.message });
    }
});

apiRouter.delete('/locations/:locID/utilities/:utilityID', async (req, res) => {
    const { locID, utilityID } = req.params;

    try {
        await pool.query(`DELETE FROM LOC_HAS_UTILITY WHERE locID = ? AND utility = ?`, [locID, utilityID]);
        res.json({ success: true, message: 'Xóa tiện ích thành công' });
    } catch (error) {
        console.error('Error removing utility:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================================================================
// LOCATION PREFERENCES - NEW
// ==================================================================
apiRouter.get('/preferences', async (req, res) => {
    try {
        const [results] = await pool.query('CALL sp_get_all_preferences()');
        res.json({ success: true, preferences: results[0] });
    } catch (error) {
        console.error('Error fetching all preferences:', error);
        res.status(500).json({ error: error.message });
    }
});

apiRouter.get('/locations/:locID/preferences', async (req, res) => {
    const { locID } = req.params;
    try {
        const [results] = await pool.query('CALL sp_get_location_preferences(?)', [locID]);
        res.json({ success: true, preferences: results[0] });
    } catch (error) {
        console.error('Error fetching location preferences:', error);
        res.status(500).json({ error: error.message });
    }
});

apiRouter.post('/locations/:locID/preferences', async (req, res) => {
    const { locID } = req.params;
    const { prefID } = req.body;

    try {
        await pool.query('CALL sp_add_location_preference(?, ?, @success, @msg)', [locID, prefID]);
        const [[outParams]] = await pool.query('SELECT @success as success, @msg as message');

        if (outParams.success) {
            res.status(201).json({ success: true, message: outParams.message });
        } else {
            res.status(400).json({ error: outParams.message });
        }
    } catch (error) {
        console.error('Error adding location preference:', error);
        res.status(500).json({ error: error.message });
    }
});

apiRouter.delete('/locations/:locID/preferences/:prefID', async (req, res) => {
    const { locID, prefID } = req.params;

    try {
        await pool.query('CALL sp_remove_location_preference(?, ?, @success, @msg)', [locID, prefID]);
        const [[outParams]] = await pool.query('SELECT @success as success, @msg as message');

        if (outParams.success) {
            res.json({ success: true, message: outParams.message });
        } else {
            res.status(400).json({ error: outParams.message });
        }
    } catch (error) {
        console.error('Error removing location preference:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================================================================
// LOCATION PRODUCTS - NEW
// ==================================================================
apiRouter.get('/locations/:locID/products', async (req, res) => {
    const { locID } = req.params;
    try {
        const [results] = await pool.query('CALL sp_get_location_products(?)', [locID]);
        res.json({ success: true, products: results[0] });
    } catch (error) {
        console.error('Error fetching location products:', error);
        res.status(500).json({ error: error.message });
    }
});

apiRouter.post('/locations/:locID/products', async (req, res) => {
    const { locID } = req.params;
    const { productName, category, basePrice, pricingUnit, description } = req.body;

    try {
        await pool.query(
            'CALL sp_create_and_add_product(?, ?, ?, ?, ?, ?, @productID, @success, @msg)',
            [locID, productName, category, basePrice, pricingUnit || null, description || null]
        );
        const [[outParams]] = await pool.query('SELECT @productID as productID, @success as success, @msg as message');

        if (outParams.success) {
            res.status(201).json({
                success: true,
                productID: outParams.productID,
                message: outParams.message
            });
        } else {
            res.status(400).json({ error: outParams.message });
        }
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: error.message });
    }
});

apiRouter.put('/products/:productID', async (req, res) => {
    const { productID } = req.params;
    const { productName, basePrice, pricingUnit, description } = req.body;

    try {
        await pool.query(
            'CALL sp_update_product(?, ?, ?, ?, ?, @success, @msg)',
            [productID, productName || null, basePrice || null, pricingUnit || null, description || null]
        );
        const [[outParams]] = await pool.query('SELECT @success as success, @msg as message');

        if (outParams.success) {
            res.json({ success: true, message: outParams.message });
        } else {
            res.status(400).json({ error: outParams.message });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: error.message });
    }
});

apiRouter.delete('/locations/:locID/products/:productID', async (req, res) => {
    const { locID, productID } = req.params;

    try {
        await pool.query('CALL sp_remove_location_product(?, ?, @success, @msg)', [locID, productID]);
        const [[outParams]] = await pool.query('SELECT @success as success, @msg as message');

        if (outParams.success) {
            res.json({ success: true, message: outParams.message });
        } else {
            res.status(400).json({ error: outParams.message });
        }
    } catch (error) {
        console.error('Error removing product:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================================================================
// MOUNT ROUTER & START SERVER
// ==================================================================
app.use('/make-server-aef03c12', apiRouter);

app.listen(port, () => {
    console.log('\n========================================');
    console.log(`📗 Database: VIVUVIET`);
    console.log(`🚀 Server: http://localhost:${port}/make-server-aef03c12`);
    console.log('========================================\n');
    console.log('✅ Endpoints (USING STORED PROCEDURES):');
    console.log('   POST   /auth/login');
    console.log('   GET    /demo-accounts');
    console.log('   POST   /locations (CALLS sp_add_location)');
    console.log('   PUT    /locations/:id (CALLS sp_update_location)');
    console.log('   DELETE /locations/:id (CALLS sp_delete_location)');
    console.log('   GET    /owner/locations (CALLS sp_get_locations_by_owner)');
    console.log('   GET    /owner/statistics (CALLS sp_get_owner_statistics)');
    console.log('   GET    /owner/notifications');
    console.log('\n📸 Location Images:');
    console.log('   GET/POST/DELETE /locations/:locID/images');
    console.log('\n🛠️  Location Utilities:');
    console.log('   GET/POST/DELETE /locations/:locID/utilities');
    console.log('\n🏷️  Location Preferences (NEW):');
    console.log('   GET    /preferences (all available)');
    console.log('   GET    /locations/:locID/preferences (CALLS sp_get_location_preferences)');
    console.log('   POST   /locations/:locID/preferences (CALLS sp_add_location_preference)');
    console.log('   DELETE /locations/:locID/preferences/:prefID (CALLS sp_remove_location_preference)');
    console.log('\n📦 Location Products (NEW):');
    console.log('   GET    /locations/:locID/products (CALLS sp_get_location_products)');
    console.log('   POST   /locations/:locID/products (CALLS sp_create_and_add_product)');
    console.log('   PUT    /products/:productID (CALLS sp_update_product)');
    console.log('   DELETE /locations/:locID/products/:productID (CALLS sp_remove_location_preference)');
    console.log('========================================\n');
});
