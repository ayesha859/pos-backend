const express = require('express');
const router = express.Router();

// This was the broken line! It needed "orderController" at the end of the path.
const { processCheckout, getDailySales } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/checkout', protect, processCheckout);
router.get('/sales', protect, admin, getDailySales);

module.exports = router;