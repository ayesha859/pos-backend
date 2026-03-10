const User = require('../models/User');

// @route   POST /api/users/staff
// @desc    Branch Admin creates a new staff member (Cashier/Manager)
exports.createStaff = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Get the branchId of the Admin making the request
    const adminBranchId = req.user.branchId; 

    if (!adminBranchId) {
        return res.status(403).json({ message: "Access denied. You are not assigned to a branch." });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    // 3. Create the new user and FORCE them into the Admin's branch
    // 🔥 We just pass the plain 'password' here. Your User.js model will hash it automatically!
    const newStaff = await User.create({
      name,
      email,
      password: password, 
      role: role || 'cashier', // If no role is sent, default to cashier
      branchId: adminBranchId, // 🛑 THE SECURITY LOCK!
      isActive: true
    });

    res.status(201).json({ 
        message: "Staff member successfully added to your branch!", 
        user: {
            _id: newStaff._id,
            name: newStaff.name,
            email: newStaff.email,
            role: newStaff.role,
            branchId: newStaff.branchId
        }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error creating staff", error: error.message });
  }
};