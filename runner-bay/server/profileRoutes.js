const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
require('dotenv').config();


const authenticateToken = require('./authenticateToken');

// This function should be exported and will be called in index.js
module.exports = function(db) {
    const router = express.Router();

    // Route to get the authenticated user's profile
    router.get('/profile', authenticateToken, async (req, res) => {
        // The user's ID should be attached to req.user by authenticateToken middleware
        const userId = req.user.userId;
        console.log("UserID from token:", userId);

        try {
            const [rows] = await db.query('SELECT id, user_fname, user_lname, username, email, user_rating, phone_number FROM users WHERE id = ?', [userId]);
            if (rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.status(404).send('User not found');
            }
        } catch (error) {
            console.error('Error fetching user information:', error);
            res.status(500).send('Failed to fetch user information');
        }
    });

    return router;
};

