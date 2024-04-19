const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const {authenticateToken, isAdmin} = require('./authenticateToken');




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

// Express route to handle requests for a single listing by ID
router.get('/listings/:listingId', async (req, res) => {
    const { listingId } = req.params;
    
    try {
        
        const [rows] = await db.query('SELECT * FROM listings WHERE listingId = ?', [listingId]);
        if (rows.length === 0) {
            res.status(404).json({ message: 'Listing not found' });
        } else {
            res.json(rows[0]);  // Return the single listing found
        }
    } catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).json({ message: 'Failed to fetch listing' });
    }
});



// Route to add a new listing
router.post('/listings', upload.single('image'), async (req, res) => {
    const { sellerId, category, title, price, description, location } = req.body; // Ensure 'location' is included
    const categoryId = Number(category);
    console.log('Received request body:', req.body); // Log the request body

    // Check for missing fields
    if (!sellerId) {
        return res.status(400).json({ message: 'Missing required field: sellerId' });
    }
    if (!categoryId || isNaN(categoryId)) { // Also check if categoryId is a valid number
        return res.status(400).json({ message: 'Missing or invalid required field: categoryId' });
    }
    if (!title) {
        return res.status(400).json({ message: 'Missing required field: title' });
    }
    if (!price) {
        return res.status(400).json({ message: 'Missing required field: price' });
    }
    if (!description) {
        return res.status(400).json({ message: 'Missing required field: description' });
    }
    if (!location) {
        return res.status(400).json({ message: 'Missing required field: location' });
    }

    const imageUrl = req.file ? req.file.filename : ''; // Store only the filename
    const status = 'active'; // Set the default status

    try {
        const sql = 'INSERT INTO listings (sellerId, categoryId, title, price, description, location, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [sellerId, categoryId, title, price, description, location, status, imageUrl];
        await db.query(sql, values);
        res.status(201).json({ message: 'Listing created successfully' });
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ message: 'Database error: Failed to create listing' });
    }
});

// Route to like a listing
router.post('/listings/:listingId/like', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { listingId } = req.params;

    try {
        const [existingLike] = await db.query('SELECT like_id FROM likes WHERE user_id = ? AND listing_id = ?', [userId, listingId]);
        if (existingLike.length > 0) {
            await db.query('DELETE FROM likes WHERE like_id = ?', [existingLike[0].like_id]);
            res.json({ message: 'Listing unliked successfully', liked: false });
        } else {
            await db.query('INSERT INTO likes (user_id, listing_id) VALUES (?, ?)', [userId, listingId]);
            res.json({ message: 'Listing liked successfully', liked: true });
        }
    } catch (error) {
        
        console.error('Error toggling like status:', error);
        res.status(500).json({ message: 'Failed to toggle like status' });
    }
});

// Route to check if a listing is liked
router.get('/listings/:listingId/is-liked', authenticateToken, async (req, res) => {
    const userId = req.user.userId;  
    const { listingId } = req.params;

    try {
        const [result] = await db.query('SELECT like_id FROM likes WHERE user_id = ? AND listing_id = ?', [userId, listingId]);
        if (result.length > 0) {
            res.json({ liked: true });
        } else {
            res.json({ liked: false });
        }
    } catch (error) {
        console.error('Error checking like status:', error);
        res.status(500).json({ message: 'Failed to check like status' });
    }
});

// Consolidated delete route
router.delete('/listings/:listingId', authenticateToken, async (req, res) => {
    const { listingId } = req.params;
    const userId = req.user.userId; 
    const userRole = req.user.role;

    try {
        const [listing] = await db.query('SELECT sellerId FROM listings WHERE listingId = ?', [listingId]);
        if (listing.length === 0) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Check if the user is the owner or an admin
        if (listing[0].sellerId !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to delete this listing' });
        }

        await db.query('DELETE FROM listings WHERE listingId = ?', [listingId]);
        res.json({ message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ message: 'Failed to delete listing' });
    }
});

// Route to contact the owner of a listing
router.post('/listings/:listingId/contact', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { listingId } = req.params;
    const { message } = req.body;  // Assuming you want to send a message with the contact request

    try {
        // Check if there's already a pending request for this user and listing
        const [existingRequest] = await db.query('SELECT request_id FROM requests WHERE listing_id = ? AND user_id = ? AND status = "pending"', [listingId, userId]);
        if (existingRequest.length > 0) {
            return res.status(400).json({ message: 'There is already a pending contact request for this listing.' });
        }

        // Insert a new request into the requests table
        await db.query('INSERT INTO requests (user_id, listing_id, status, message) VALUES (?, ?, "pending", ?)', [userId, listingId, message]);

        // Respond with success message
        res.status(201).json({ message: 'Contact request sent successfully.' });
    } catch (error) {
        console.error('Error sending contact request:', error);
        res.status(500).json({ message: 'Failed to send contact request. Please try again later.' });
    }
});



// Route to get all contact requests for a seller
router.get('/requests', authenticateToken, async (req, res) => {
    const sellerId = req.user.userId;
    
    try {
        const query = `
        SELECT r.request_id, r.user_id, r.listing_id, r.status, r.created_at, u.username as buyer_username, l.title as listing_title
        FROM requests r
        JOIN listings l ON r.listing_id = l.listingId
        JOIN users u ON r.user_id = u.id
        WHERE l.sellerId = ? AND r.status = 'pending';
        `;
        const [rows] = await db.query(query, [sellerId]);
        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).json({ message: 'No contact requests found.' });
        }
    } catch (error) {
        console.error('Error fetching contact requests:', error);
        res.status(500).json({ message: 'Failed to fetch contact requests.' });
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

