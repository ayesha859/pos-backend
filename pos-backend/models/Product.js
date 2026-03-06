const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  barcode:     { type: String, required: true, unique: true, trim: true },
  category:    { type: String, required: true, trim: true },
  name:        { type: String, required: true, trim: true },
  description: { type: String, trim: true }, // Added for frontend product cards
  imageUrl:    { type: String, trim: true }, // Added to display product images
  price:       { type: Number, required: true, min: 0 },
  stock:       { type: Number, required: true, min: 0, default: 0 },
  isActive:    { type: Boolean, default: true } // Soft-delete flag to protect sales history
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);