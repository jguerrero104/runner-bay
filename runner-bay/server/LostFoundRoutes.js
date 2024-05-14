const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('./authenticateToken');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

module.exports = function(db) {
    const router = express.Router();

    router.get('/lostAndFounds', async (req, res) => {
        try {
            const [rows] = await db.query('SELECT * FROM lostandfound');
            res.json(rows);
        } catch (error) {
            console.error('Error fetching lostandfound:', {
                message: error.message,
                stack: error.stack,
                code: error.code,
                errno: error.errno,
                sql: error.sql,
            });
            res.status(500).json({ message: 'Failed to fetch lostandfound' });
        }
    });

    router.get('/lostAndFounds/:itemId', async (req, res) => {
        const { itemId } = req.params;
        console.log('Received request for lost item with ID:', itemId);
        try {
            const [rows] = await db.query('SELECT * FROM lostandfound WHERE itemId = ?', [itemId]);
            if (rows.length === 0) {
                console.error('Lost item not found for ID:', itemId);
                return res.status(404).json({ message: 'Lost item not found' });
            } else {
                res.json(rows[0]);
            }
        } catch (error) {
            console.error('Error fetching lost item:', {
                message: error.message,
                stack: error.stack,
                code: error.code,
                errno: error.errno,
                sql: error.sql,
            });
            res.status(500).json({ message: 'Failed to fetch lost item' });
        }
    });

    router.post('/lostAndFounds/:itemId/contact', authenticateToken, async (req, res) => {
        const userId = req.user.userId;
        const { itemId } = req.params;
        const { message } = req.body;

        try {
            const [existingRequest] = await db.query('SELECT lostrequest_id FROM lostrequest WHERE lost_item_id = ? AND request_id = ?', [itemId, userId]);
            if (existingRequest.length > 0) {
                return res.status(400).json({ message: 'There is already a pending contact request for this item.' });
            }

            await db.query('INSERT INTO lostrequest (lost_item_id, request_id) VALUES (?, ?)', [itemId, userId]);
            res.status(201).json({ message: 'Contact request sent successfully.' });
        } catch (error) {
            console.error('Error sending contact request:', {
                message: error.message,
                stack: error.stack,
                code: error.code,
                errno: error.errno,
                sql: error.sql,
            });
            res.status(500).json({ message: 'Failed to send contact request. Please try again later.' });
        }
    });

    router.post('/lostAndFounds', upload.single('image'), async (req, res) => {
        const { itemName, description, location, reportDate } = req.body;
        const reporterId = Number(req.body.reporterId);
        console.log('Received request body:', req.body);

        if (!itemName) return res.status(400).json({ message: 'Missing required field: itemName' });
        if (!description) return res.status(400).json({ message: 'Missing required field: description' });
        if (!location) return res.status(400).json({ message: 'Missing required field: location' });
        if (!reportDate) return res.status(400).json({ message: 'Missing required field: reportDate' });

        const imageUrl = req.file ? req.file.filename : '';
        const status = 'active';

        try {
            const sql = 'INSERT INTO lostandfound (itemName, description, location, image_url, reportDate, status) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [itemName, description, location, imageUrl, reportDate, status];
            await db.query(sql, values);
            res.status(201).json({ message: 'Lost item created successfully' });
        } catch (error) {
            console.error('Error creating lost item:', {
                message: error.message,
                stack: error.stack,
                code: error.code,
                errno: error.errno,
                sql: error.sql,
            });
            res.status(500).json({ message: 'Failed to create lost item', error: error.message });
        }
    });

    return router;
}
