const Product = require('../models/Product');

// 1. GET ALL PRODUCTS (Branch-Aware & Active Only)
exports.getAllProducts = async (req, res) => {
  try {
    // MAGIC HAPPENS HERE: We filter by branchId AND make sure it isn't "deleted"
    const products = await Product.find({ 
      branchId: req.user.branchId, 
      isActive: true 
    }).lean();
    
    // Add status to every product in the list
    const updatedProducts = products.map(p => ({
      ...p,
      status: p.stock <= 0 ? 'unavailable' : 'available'
    }));

    res.status(200).json(updatedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// 2. ADD PRODUCT (Locked to User's Branch)
exports.addProduct = async (req, res) => {
  try {
    const { barcode, category, name, price, stock, description, imageUrl } = req.body;

    if (!barcode?.trim() || !category?.trim() || !name?.trim() || price === undefined) {
      return res.status(400).json({ message: 'Barcode, category, name, and price are required' });
    }

    // NEW: Automatically attach the logged-in user's branchId
    const newProduct = new Product({ 
      branchId: req.user.branchId, 
      barcode, category, name, price, stock, description, imageUrl 
    });
    await newProduct.save();
    
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    // Custom error message for the Compound Index we made earlier
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This barcode already exists in your branch' });
    }
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

// 3. UPDATE PRODUCT (Secured by Branch)
exports.updateProduct = async (req, res) => {
  try {
    // SECURITY: We require BOTH the product ID and the branchId to match
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, branchId: req.user.branchId }, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found in your branch' });
    res.status(200).json({ message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// 4. DELETE PRODUCT (Converted to Soft Delete!)
exports.deleteProduct = async (req, res) => {
  try {
    // SOFT DELETE: Instead of destroying the data (which breaks old receipts), 
    // we just set isActive to false so it disappears from the POS screen.
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, branchId: req.user.branchId },
      { isActive: false },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found in your branch' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// 5. GET BY BARCODE (Branch-Aware)
exports.getProductByBarcode = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      barcode: req.params.barcode,
      branchId: req.user.branchId,
      isActive: true 
    }).lean();

    if (!product) return res.status(404).json({ message: 'Product not found in your branch' });
    
    product.status = product.stock <= 0 ? 'unavailable' : 'available';
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// 6. GET BY NAME (Branch-Aware)
exports.getProductByName = async (req, res) => {
  try {
    const searchName = req.params.name;
    const product = await Product.findOne({ 
      name: { $regex: new RegExp(`^${searchName}$`, 'i') },
      branchId: req.user.branchId,
      isActive: true
    }).lean();
    
    if (!product) return res.status(404).json({ message: 'Product not found in your branch' });
    
    product.status = product.stock <= 0 ? 'unavailable' : 'available';
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product by name', error: error.message });
  }
};