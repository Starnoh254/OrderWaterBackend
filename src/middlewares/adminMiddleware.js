const jwt = require('jsonwebtoken');

/**
 * Admin Authorization Middleware
 * 
 * This middleware checks if the user has admin role.
 * It must be used AFTER the authenticateToken middleware.
 * 
 * Usage:
 * - Apply this middleware to routes that require admin access:
 *     router.get('/admin-only', authenticateToken, requireAdmin, controller);
 * 
 * How it works:
 * - Checks if req.user exists (should be set by authenticateToken middleware)
 * - Verifies that the user's role is 'admin'
 * - Returns 403 Forbidden if user is not an admin
 * - Calls next() if user is an admin
 */
function requireAdmin(req, res, next) {
    // Check if user is authenticated (should be set by authenticateToken middleware)
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }

    // User is admin, proceed to next middleware/controller
    next();
}

module.exports = requireAdmin;
