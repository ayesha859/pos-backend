const express = require('express');
const router = express.Router();

// 1. IMPORT YOUR AUTH MIDDLEWARE (Crucial!)
// This grabs the token, finds the user, and attaches req.user (including branchId)
const { protect } = require('../middleware/authMiddleware');

// 2. IMPORT ALL CONTROLLER FUNCTIONS
const { 
  addProduct, 
  getProductByBarcode,
  getProductByName,
  getAllProducts,
  updateProduct, // Added
  deleteProduct  // Added
} = require('../controllers/productController');

// 3. APPLY THE 'protect' MIDDLEWARE TO EVERY ROUTE
// By putting 'protect' in the middle, we guarantee that the user is logged in
// and that their branchId is ready to be used by the controller.

// Get all products for the cashier's branch
router.get('/', protect, getAllProducts); 

// Add a new product to the branch
router.post('/', protect, addProduct);

// Update a product (Price change, restock, etc.)
router.put('/:id', protect, updateProduct);

// Soft delete a product
router.delete('/:id', protect, deleteProduct);

// Search by name
router.get('/name/:name', protect, getProductByName); 

// Search by barcode
router.get('/:barcode', protect, getProductByBarcode);

module.exports = router;