const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  // This links the branch directly to the main Brand
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true // e.g., "Nan-Channy Downtown" or "Branch 1"
  },
  address: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    trim: true
  },
  // In case a specific location closes down temporarily or permanently
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Branch', BranchSchema);