const Product = require('../models/Product');

// 1. GET ALL PRODUCTS (The fix for your 404!)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();
    
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

// 2. ADD PRODUCT
exports.addProduct = async (req, res) => {
  try {
    const { barcode, category, name, price, stock } = req.body;

    if (!barcode?.trim() || !category?.trim() || !name?.trim() || price === undefined) {
      return res.status(400).json({ message: 'Barcode, category, name, and price are required' });
    }

    const newProduct = new Product({ barcode, category, name, price, stock });
    await newProduct.save();
    
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Barcode already exists' });
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

// 3. UPDATE PRODUCT (New!)
// Use this to change price or restock items
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// 4. DELETE PRODUCT (New!)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// 5. GET BY BARCODE
exports.getProductByBarcode = async (req, res) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode }).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    product.status = product.stock <= 0 ? 'unavailable' : 'available';
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// 6. GET BY NAME
exports.getProductByName = async (req, res) => {
  try {
    const searchName = req.params.name;
    const product = await Product.findOne({ 
      name: { $regex: new RegExp(`^${searchName}$`, 'i') } 
    }).lean();
    
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.status = product.stock <= 0 ? 'unavailable' : 'available';
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product by name', error: error.message });
  }
};