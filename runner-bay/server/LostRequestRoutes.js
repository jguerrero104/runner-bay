const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./authenticateToken');

module.exports = function(db) {
    // Route to retrieve all contact requests for a lost item
    router.get('/lostrequests/:lostItemId', authenticateToken, async (req, res) => {
        const lostItemId = req.params.lostItemId;

        try {
            const query = `
            SELECT lr.lostrequest_id, lr.lost_item_id, lr.request_id, lr.status, lr.created_at, lr.updated_at,
            u.username AS requester_username, lf.itemName AS lost_item_name
            FROM lostrequest lr
            JOIN users u ON lr.request_id = u.id
            JOIN lostandfound lf ON lr.lost_item_id = lf.itemId
            WHERE lr.lost_item_id = ?;
            `;
            const [rows] = await db.query(query, [lostItemId]);
            if (rows.length > 0) {
                res.json(rows);
            } else {
                res.status(404).json({ message: 'No contact requests found for the lost item.' });
            }
        } catch (error) {
            console.error('Error fetching contact requests for lost item:', {
                message: error.message,
                stack: error.stack,
                code: error.code,
                errno: error.errno,
                sql: error.sql,
            });
            res.status(500).json({ message: 'Failed to fetch contact requests for lost item.' });
        }
    });

    // Route to accept a contact request for a lost item
    router.post('/lostrequests/:lostRequestId/accept', authenticateToken, async (req, res) => {
        const { lostRequestId } = req.params;

        try {
            // Update the status of the lost request to 'accepted'
            await db.query('UPDATE lostrequest SET status = "accepted" WHERE lostrequest_id = ?', [lostRequestId]);

            res.json({ message: 'Lost request accepted successfully.' });
        } catch (error) {
            console.error('Error accepting lost request:', {
                message: error.message,
                stack: error.stack,
                code: error.code,
                errno: error.errno,
                sql: error.sql,
            });
            res.status(500).json({ message: 'Failed to accept lost request.' });
        }
    });

    // Route to decline a contact request for a lost item
    router.post('/lostrequests/:lostRequestId/decline', authenticateToken, async (req, res) => {
        const { lostRequestId } = req.params;

        try {
            // Update the status of the lost request to 'declined'
            await db.query('UPDATE lostrequest SET status = "declined" WHERE lostrequest_id = ?', [lostRequestId]);

            res.json({ message: 'Lost request declined successfully.' });
        } catch (error) {
            console.error('Error declining lost request:', {
                message: error.message,
                stack: error.stack,
                code: error.code,
                errno: error.errno,
                sql: error.sql,
            });
            res.status(500).json({ message: 'Failed to decline lost request.' });
        }
    });

    return router;
}
