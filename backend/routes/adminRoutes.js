const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All admin routes require authentication AND admin role
router.use(authMiddleware);

// Get all users
router.get('/users', adminController.getAllUsers);

// Get dashboard statistics
router.get('/stats', adminController.getDashboardStats);

// Make user admin
router.put('/make-admin/:userId', adminController.makeAdmin);

module.exports = router;
