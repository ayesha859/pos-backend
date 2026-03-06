const express = require('express');
const router = express.Router();

// Import the logic from the auth controller
const { registerUser, loginUser } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Log in a user & get token
router.post('/login', loginUser);

// THIS IS THE MOST IMPORTANT LINE - It stops the crash!
module.exports = router;
