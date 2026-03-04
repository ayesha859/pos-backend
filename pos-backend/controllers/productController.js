const Product = require('../models/Product');

// 1. Add a New Product (POST /api/products)
// Now includes the category field
exports.addProduct = async (req, res) => {
  try {
    const { barcode, name, price, stock, category } = req.body;
    
    // Create new product with category logic
    const newProduct = new Product({ barcode, name, price, stock, category });
    await newProduct.save();

    res.status(201).json({ 
      message: "Product added successfully", 
      product: newProduct 
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
};

// 2. Get Product By Barcode (GET /api/products/barcode/:barcode)
exports.getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;
    const product = await Product.findOne({ barcode: barcode });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 3. NEW: Get Product By Database ID (GET /api/products/id/:id)
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Internal ID not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Invalid ID format", error: error.message });
  }
};

// 4. NEW: Get Products By Category (GET /api/products/category/:category)
// Useful for Laiba to show items by group (A, B, C, or D)
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category: category.toUpperCase() });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};