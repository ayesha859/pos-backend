const express = require('express');
const router = express.Router();
const { processCheckout, getDailySales } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/checkout', protect, processCheckout);
router.get('/sales', protect, admin, getDailySales);

module.exports = router;