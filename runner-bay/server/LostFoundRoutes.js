const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append the timestamp to the original file name to avoid conflicts
    },
});
const upload = multer({ storage: storage });

module.exports = function(db) {
    const router = express.Router();

    // Route to get all listings

    router.get('/lostAndFounds', async (req, res) => {
        try {
            const [rows] = await db.query('SELECT * FROM lostandfound');
            res.json(rows);
        } catch (error) {
            console.error('Error fetching lostandfound:', error);
            res.status(500).json({ message: 'Failed to fetch lostandfound' });
        }
    });

    // Route to get a specific lost and found item
    
    router.get('/lostAndFounds/:itemId', async (req, res) => {
        const { itemId } = req.params;
        console.log('Received request for lost item with ID:', itemId); // Log the received item ID
        try {
            const [rows] = await db.query('SELECT * FROM lostandfound WHERE itemId = ?', [itemId]);
            if (rows.length === 0) {
                console.error('Lost item not found for ID:', itemId); // Log if the item is not found
                return res.status(404).json({ message: 'Lost item not found' });
            } else {
                res.json(rows[0]);
            }
        } catch (error) {
            console.error('Error fetching lost item:', error); // Log database query errors
            res.status(500).json({ message: 'Failed to fetch lost item' });
        }
    });
    

    // Route to add a new listing

    router.post('/lostAndFounds', upload.single('image'), async (req, res) => {
        const { itemName, description, location, reportDate } = req.body;
        const reporterId = Number(req.body.reporterId);
        console.log('Received request body:', req.body); // Log the request body
    
        if (!itemName) return res.status(400).json({ message: 'Missing required field: itemName' });
        if (!description) return res.status(400).json({ message: 'Missing required field: description' });
        if (!location) return res.status(400).json({ message: 'Missing required field: location' });
        if (!reportDate) return res.status(400).json({ message: 'Missing required field: reportDate' });
    
        const imageUrl = req.file ? req.file.filename : ''; // Store only the filename
        const status = 'active'; // Set the default status
    
        try {
            const sql = 'INSERT INTO lostandfound (itemName, description, location, image_url, reportDate, status) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [itemName, description, location, imageUrl, reportDate, status];
            await db.query(sql, values);
            res.status(201).json({ message: 'Lost item created successfully' });
        } catch (error) {
            console.error('Error creating lost item:', error);
            res.status(500).json({ message: 'Failed to create lost item', error: error.message });
        }
    });
    

    return router;
}