const User = require('../models/User');
const Branch = require('../models/Branch'); // Needed for the Super Admin search

// 1. CREATE STAFF (Branch Admin adds an employee)
exports.createStaff = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Get the branchId of the Admin making the request
    const adminBranchId = req.user.branchId; 

    if (!adminBranchId) {
        return res.status(403).json({ message: "Access denied. You are not assigned to a branch." });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    // Create the new user and FORCE them into the Admin's branch
    const newStaff = await User.create({
      name,
      email,
      password: password, 
      role: role || 'cashier', 
      branchId: adminBranchId, 
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

// 2. GET BRANCH STAFF (Branch Admin sees their own employees)
exports.getBranchStaff = async (req, res) => {
  try {
    const adminBranchId = req.user.branchId;

    if (!adminBranchId) {
      return res.status(403).json({ message: "Access denied. No branch assigned." });
    }

    const staff = await User.find({ branchId: adminBranchId }).select('-password');
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching staff", error: error.message });
  }
};

// 3. GET STAFF BY BRANCH NAME (Super Admin Only)
exports.getStaffByBranchName = async (req, res) => {
  try {
    // Only Super Admins can use this feature
    if (req.user.role !== 'superadmin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Super Admin only." });
    }

    const searchName = req.params.branchName;

    // Find the branch by name (case-insensitive)
    const branch = await Branch.findOne({ 
      name: { $regex: new RegExp(`^${searchName}$`, 'i') } 
    });

    if (!branch) {
      return res.status(404).json({ message: `No branch found named: ${searchName}` });
    }

    // Find all staff linked to that branch
    const staff = await User.find({ branchId: branch._id }).select('-password');

    res.status(200).json({
      branchName: branch.name,
      totalEmployees: staff.length,
      staff: staff
    });

  } catch (error) {
    res.status(500).json({ message: "Server error fetching staff", error: error.message });
  }
};