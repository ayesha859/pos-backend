const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'supersecretkey123', {
    expiresIn: '1d',
  });
};

// 1. REPLACED REGISTER WITH ADMIN-ONLY ADD USER
// @desc    Admin adds a new employee/user
// @route   POST /api/auth/add-user
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role, branchId, isActive } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Admin creates the user with branch and active status
    const user = await User.create({
      name,
      email,
      password, // Still gets hashed automatically by your model!
      role: role || 'employee',
      branchId: branchId || null,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({ 
      message: 'User created successfully by Admin',
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        branchId: user.branchId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// 2. UPDATED LOGIN TO CHECK FOR isActive
// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      
      // NEW EDGE CASE: Check if the admin deactivated them!
      if (!user.isActive) {
        return res.status(403).json({ message: 'Your account has been deactivated. Please contact the Admin.' });
      }

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        branchId: user.branchId, // Send branchId to frontend so they only see their branch data
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};