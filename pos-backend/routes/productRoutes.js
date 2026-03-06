const express = require('express');
const router = express.Router();

const { 
  addProduct, 
  getProductByBarcode,
  getProductByName,
  getAllProducts // 1. ADD THIS IMPORT
} = require('../controllers/productController');

// 2. ADD THIS ROUTE (This fixes the 404 for /api/products)
router.get('/', getAllProducts); 

router.post('/', addProduct);

router.get('/name/:name', getProductByName); 

router.get('/:barcode', getProductByBarcode);

module.exports = router;