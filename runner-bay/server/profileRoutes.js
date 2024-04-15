const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
require('dotenv').config();


const authenticateToken = require('./authenticateToken');

module.exports = function(db) {
    const router = express.Router();

    // Route to get the authenticated user's profile
    router.get('/profile', authenticateToken, async (req, res) => {
        
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

    // Route to update the authenticated user's profile
    router.patch('/profile', authenticateToken, async (req, res) => {
        const userId = req.user.userId;
        const { user_fname, user_lname, phone_number } = req.body;

        try {
            const updates = {};
            if (user_fname) updates.user_fname = user_fname;
            if (user_lname) updates.user_lname = user_lname;
            if (phone_number) updates.phone_number = phone_number;

            const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
            const values = Object.values(updates);

            if (fields.length > 0) {
                await db.query(`UPDATE users SET ${fields} WHERE id = ?`, [...values, userId]);
                res.json({ message: 'Profile updated successfully.' });
            } else {
                res.status(400).send('No valid fields provided for update.');
            }
        } catch (error) {
            console.error('Error updating user information:', error);
            res.status(500).send('Failed to update user information');
        }
    });


    return router;
};

