const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/adminMiddleware');

// Example admin-only route
router.get('/dashboard', authenticateToken, requireAdmin, (req, res) => {
    res.json({
        message: 'Welcome to admin dashboard',
        admin: req.user
    });
});

// Example route to get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        // Here you would typically fetch all users from database
        res.json({
            message: 'Admin access granted - user list',
            note: 'This would return all users from database'
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
