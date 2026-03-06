const mongoose = require('mongoose');

// We create a sub-schema for the items in the cart
const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Links to your Product model
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  priceAtPurchase: { 
    type: Number, 
    required: true 
    // We save the price here so past receipts don't change if you update product prices later
  }
});

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links to the User who bought it
    required: true
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending' // Starts as pending until payment succeeds
  }
}, { timestamps: true }); // timestamps automatically handle the date for our admin sales query

module.exports = mongoose.model('Order', OrderSchema);