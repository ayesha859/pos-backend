const express = require('express');
const router = express.Router();
const { createStaff } = require('../controllers/userController');

// Import your authentication middleware
// (Adjust the path if your middleware is named differently!)
const { protect } = require('../middleware/authMiddleware'); 

// Only logged-in users (like your Admin) can hit this route
router.post('/staff', protect, createStaff);

module.exports = router;