const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

const router = express.Router();

// Multer Setup for Image Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

/**
 * @route   POST /products/create
 * @desc    Create a new product (with seller ID and stock)
 */
router.post('/create', upload.single('image'), async (req, res) => {
  try {
    const { title, price, category, seller, stock } = req.body;
    const image = req.file ? req.file.filename : '';

    const newProduct = new Product({
      title,
      price,
      category,
      image,
      seller,
      stock: stock || 1, // Default to 1 if no stock is provided
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /products/all
 * @desc    Get all products
 */
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /products/seller/:id
 * @desc    Get products by seller ID
 */
router.get('/seller/:id', async (req, res) => {
  try {
    const sellerId = req.params.id;
    const products = await Product.find({ seller: sellerId });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /products/:id
 * @desc    Get a single product by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /products/:id/buy
 * @desc    Reduce stock by 1 when product is bought and update sold status if stock reaches 0
 */
router.put('/:id/buy', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock > 0) {
      product.stock -= 1;

      // If stock reaches 0, mark product as sold
      if (product.stock === 0) {
        product.sold = true;
      }

      await product.save();
      res.json({ message: 'Product purchased successfully', product });
    } else {
      res.status(400).json({ message: 'Product out of stock' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /products/:id
 * @desc    Delete a product by ID
 */
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /products/:id
 * @desc    Update a product by ID
 */
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, price, category, stock } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const updateFields = {
      title,
      price,
      category,
      stock,
    };

    if (image) updateFields.image = image;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
