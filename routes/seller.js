const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/stats/:sellerId', async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const products = await Product.find({ sellerId });

    const totalProducts = products.length;
    const totalEarnings = products.reduce((sum, p) => {
      const soldQty = p.initialStock - p.stock; // assuming you save initial stock when product is created
      return sum + (soldQty * p.price);
    }, 0);

    res.json({ totalProducts, totalEarnings });
  } catch (err) {
    console.error('Error fetching seller stats:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
