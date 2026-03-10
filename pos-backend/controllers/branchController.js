const Brand = require('../models/Brand');
const Branch = require('../models/Branch');

// 1. CREATE THE MAIN BRAND (e.g., "Nan-Channy Shop")
// @route   POST /api/branches/brand
exports.createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;
    const brand = await Brand.create({ name, description });
    
    res.status(201).json({ message: 'Brand created successfully!', brand });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'This Brand already exists' });
    res.status(500).json({ message: 'Error creating Brand', error: error.message });
  }
};

// 2. CREATE A PHYSICAL BRANCH (e.g., "Main Street Store")
// @route   POST /api/branches
exports.createBranch = async (req, res) => {
  try {
    const { brandId, name, address, contactNumber } = req.body;
    
    if (!brandId || !name || !address) {
      return res.status(400).json({ message: 'Brand ID, name, and address are required' });
    }

    // 🛑 NEW SECURITY LOGIC: CHECK FOR DUPLICATES 🛑
    const existingBranch = await Branch.findOne({ 
      brandId: brandId,
      name: name, 
      address: address 
    });

    if (existingBranch) {
      return res.status(400).json({ 
        message: "Duplicate Error: A branch with this exact name and address already exists!" 
      });
    }
    // ----------------------------------------------

    const branch = await Branch.create({ brandId, name, address, contactNumber });
    res.status(201).json({ message: 'Branch created successfully!', branch });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Branch', error: error.message });
  }
};

// 3. GET ALL BRANCHES (So the Super Admin can see a list of all stores)
// @route   GET /api/branches
exports.getAllBranches = async (req, res) => {
  try {
    // .populate() pulls in the Brand name so you don't just see a random ID
    const branches = await Branch.find({ isActive: true }).populate('brandId', 'name');
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Branches', error: error.message });
  }
};