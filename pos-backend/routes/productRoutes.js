const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Define the routes and connect them to the controller
router.post('/', productController.addProduct);
router.get('/:barcode', productController.getProductByBarcode);

module.exports = router;