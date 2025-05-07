const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Get cart items for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(200).json({ items: [] }); // No cart = empty items
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

module.exports = router;
