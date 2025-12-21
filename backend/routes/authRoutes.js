// Auth Routes - defines authentication endpoints
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);
// @route   POST /api/auth/login
// @desc    Login user and return JWT token
// @access  Public
router.post('/login', authController.login);

// We'll add login route in the next step

module.exports = router;