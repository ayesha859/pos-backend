const Order = require('../models/Order');
const Product = require('../models/Product');

exports.processCheckout = async (req, res) => {
  try {
    const { cartItems } = req.body;
    if (!cartItems || cartItems.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    let totalAmount = 0;
    const finalOrderItems = [];

    // Store the cashier's branch ID from their login token
    const branchId = req.user.branchId;

    for (const item of cartItems) {
      // SECURITY: Ensure the product exists IN THEIR BRANCH and is active
      const product = await Product.findOne({
        _id: item.productId,
        branchId: branchId,
        isActive: true
      });

      if (!product) return res.status(404).json({ message: 'Product not found in your branch' });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Not enough stock for ${product.name}` });

      totalAmount += product.price * item.quantity;
      finalOrderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price
      });
    }

    const order = new Order({
      branchId: branchId, // NEW: Link the final receipt to the branch!
      user: req.user._id,
      items: finalOrderItems,
      totalAmount,
      status: 'completed'
    });

    const savedOrder = await order.save();

    for (const item of cartItems) {
      // SECURITY: Only deduct stock from THIS branch's inventory
      await Product.findOneAndUpdate(
        { _id: item.productId, branchId: branchId }, 
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({ message: 'Order placed', orderId: savedOrder._id, totalAmount });
  } catch (error) {
    res.status(500).json({ message: 'Checkout failed', error: error.message });
  }
};

exports.getDailySales = async (req, res) => {
  try {
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();
    
    // Tiny fix: We clone the date object so start and end don't mutate each other
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      branchId: req.user.branchId, // NEW: Admins only see sales for their specific branch!
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: 'completed'
    }).populate('user', 'name email');

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.status(200).json({ 
      date: startOfDay.toISOString().split('T')[0], 
      totalOrders: orders.length, 
      totalRevenue, 
      orders 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales', error: error.message });
  }
};