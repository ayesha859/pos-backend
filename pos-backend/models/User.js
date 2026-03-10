const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['employee', 'admin', 'superadmin', 'cashier', 'manager'], 
    default: 'cashier' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  branchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Branch', 
    required: false 
  }
}, { timestamps: true });

// 🔥 FIXED: Removed all the "next" stuff! Just pure async/await now.
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err; 
  }
});

// Helper method to verify passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = mongoose.model('User', UserSchema);