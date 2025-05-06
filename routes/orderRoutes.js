const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// POST /orders - Place a new order
router.post('/', async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || !items.length) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    // Create the order
    const newOrder = new Order({ userId, items });
    await newOrder.save();

    // Update products (reduce stock, mark sold, add earnings)
    for (const item of items) {
      const product = await Product.findById(item._id);
      if (!product) continue;

      // Reduce stock
      product.stock = (product.stock || 0) - item.quantity;

      // Mark as sold if out of stock
      if (product.stock <= 0) {
        product.sold = true;
        product.stock = 0;
      }

      // Update earnings
      product.earnings = (product.earnings || 0) + (item.price * item.quantity);

      await product.save();
    }

    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error('Order creation failed:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
