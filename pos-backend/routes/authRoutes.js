const express = require('express');
const router = express.Router();

// Import your auth controller logic
const { addUser, loginUser } = require('../controllers/authController');

// Import your middlewares
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/auth/add-user
// @desc    Admin creates a new user (SECURED!)
// NEW: Added protect and admin middlewares here
router.post('/add-user', protect, admin, addUser);

// @route   POST /api/auth/login
// @desc    Log in a user & get token (PUBLIC)
router.post('/login', loginUser);

module.exports = router;