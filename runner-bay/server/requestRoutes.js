const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const {authenticateToken, isAdmin} = require('./authenticateToken');




module.exports = function(db) {
    const router = express.Router();

    // Get all contact requests for a seller
    router.get('/requests', authenticateToken, async (req, res) => {
        const sellerId = req.user.userId;
        
        try {
            const query = `
            SELECT r.request_id, r.user_id, r.listing_id, r.status, r.created_at, r.message, u.username as buyer_username, l.title as listing_title
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
    

// Route to accept a contact request and optionally update listing status
router.post('/requests/:requestId/accept', authenticateToken, async (req, res) => {
    const { requestId } = req.params;
    const { listingStatus } = req.body;  // "active", "pending", or "sold"
    const userId = req.user.userId;

    try {
        const [request] = await db.query(`
            SELECT r.*, l.sellerId, u.phone_number as buyer_phone
            FROM requests r
            JOIN listings l ON r.listing_id = l.listingId
            JOIN users u ON r.user_id = u.id
            WHERE r.request_id = ? AND l.sellerId = ?
        `, [requestId, userId]);

        if (request.length === 0) {
            return res.status(404).json({ message: 'Request not found or you are not the seller of the listing.' });
        }

        // Update the request status to 'accepted'
        await db.query('UPDATE requests SET status = "accepted" WHERE request_id = ?', [requestId]);

        // Handle listing status update based on the seller's choice
        if (listingStatus === 'sold') {
            // If sold, consider archiving instead of deleting
            await db.query('UPDATE listings SET status = ? WHERE listingId = ?', ['sold', request[0].listing_id]);
        } else {
            // For "active" or "pending", just update the status
            await db.query('UPDATE listings SET status = ? WHERE listingId = ?', [listingStatus, request[0].listing_id]);
        }

        res.json({
            message: 'Contact request accepted and listing status updated successfully.',
            buyerPhone: request[0].buyer_phone
        });
    } catch (error) {
        console.error('Error accepting contact request:', error);
        res.status(500).json({ message: 'Failed to accept contact request.' });
    }
});





// Route to decline a contact request
router.post('/requests/:requestId/decline', authenticateToken, async (req, res) => {
    const { requestId } = req.params;
    const userId = req.user.userId;

    try {
        const [request] = await db.query(`
            SELECT r.*, l.sellerId
            FROM requests r
            JOIN listings l ON r.listing_id = l.listingId
            WHERE r.request_id = ? AND l.sellerId = ?
        `, [requestId, userId]);

        if (request.length === 0) {
            return res.status(404).json({ message: 'Request not found or you are not the seller of the listing.' });
        }

        await db.query('UPDATE requests SET status = "declined" WHERE request_id = ?', [requestId]);
        await db.query('UPDATE listings SET status = "active" WHERE listingId = ?', [request[0].listing_id]);

        res.json({ message: 'Contact request declined and listing set to active successfully.' });
    } catch (error) {
        console.error('Error declining contact request:', error);
        res.status(500).json({ message: 'Failed to decline contact request.' });
    }
});

    
    return router;
}
