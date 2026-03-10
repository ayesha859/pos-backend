const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  branchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Branch', 
    required: true 
  },
  // 1. REMOVE 'unique: true' from here!
  barcode:     { type: String, required: true, trim: true }, 
  category:    { type: String, required: true, trim: true },
  name:        { type: String, required: true, trim: true },
  description: { type: String, trim: true }, 
  imageUrl:    { type: String, trim: true }, 
  price:       { type: Number, required: true, min: 0 },
  stock:       { type: Number, required: true, min: 0, default: 0 },
  isActive:    { type: Boolean, default: true } 
}, { timestamps: true });

// 2. ADD THIS LINE: The Compound Index
// This means "BranchId + Barcode" together must be unique.
ProductSchema.index({ branchId: 1, barcode: 1 }, { unique: true });

module.exports = mongoose.model('Product', ProductSchema);