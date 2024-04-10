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
router.get('/listings', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM listings');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ message: 'Failed to fetch listings' });
    }
});

// Route to add a new listing
router.post('/listings', upload.single('image'), async (req, res) => {
    const { sellerId, category, title, price, description } = req.body;
    const categoryId = Number(category);
    console.log('Received request body:', req.body); // Log the request body

    if (!sellerId) return res.status(400).json({ message: 'Missing required field: sellerId' });
    if (!categoryId) return res.status(400).json({ message: 'Missing required field: categoryId' });
    if (!title) return res.status(400).json({ message: 'Missing required field: title' });
    if (!price) return res.status(400).json({ message: 'Missing required field: price' });
    if (!description) return res.status(400).json({ message: 'Missing required field: description' });
    
    const imageUrl = req.file ? req.file.filename : ''; // Store only the filename
    const status = 'active'; // Set the default status    

    try {
        const sql = 'INSERT INTO listings (sellerId, categoryId, title, price, description, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [sellerId, categoryId, title, price, description, status, imageUrl];
        await db.query(sql, values);
        res.status(201).json({ message: 'Listing created successfully' });
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ message: 'Failed to create listing' });
    }
    
});

//Delete a listing
router.delete('/listings/:listingId', async (req, res) => {
    const { listingId } = req.params;

    try {
        const sql = 'DELETE FROM listings WHERE listingId = ?';
        const [result] = await db.query(sql, [listingId]);

        if (result.affectedRows > 0) {
            res.json({ message: 'Listing deleted successfully' });
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ message: 'Failed to delete listing' });
    }
});


// Route to get all categories
router.get('/categories', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
});



return router;
}

