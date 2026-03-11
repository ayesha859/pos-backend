const express = require('express');
const router = express.Router();

// 🌟 NEW: We added getBranchStaff and getStaffByBranchName to the import
const { 
  createStaff, 
  getBranchStaff, 
  getStaffByBranchName 
} = require('../controllers/userController');

// Import your authentication middleware
const { protect } = require('../middleware/authMiddleware'); 

// 1. Add a new staff member (Admin)
router.post('/staff', protect, createStaff);

// 2. Get all staff for the logged-in admin's branch
router.get('/staff', protect, getBranchStaff);

// 3. Get all staff for a specific branch by its name (Super Admin Only)
router.get('/staff/branch/:branchName', protect, getStaffByBranchName);

module.exports = router;