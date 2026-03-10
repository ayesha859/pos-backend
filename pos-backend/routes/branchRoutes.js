const express = require('express');
const router = express.Router();
const { createBrand, createBranch, getAllBranches } = require('../controllers/branchController');

// Bring in your security so ONLY Admins can create new stores
const { protect, admin } = require('../middleware/authMiddleware');

// Route to create the main Umbrella Brand
router.post('/brand', protect, admin, createBrand);

// Route to create individual physical shops
router.post('/', protect, admin, createBranch);

// Route to get a list of all shops
router.get('/', protect, admin, getAllBranches);

module.exports = router;