const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
  },
  stock: {
    type: Number,
    required: true,
    default: 1,
  },
  sold: {
    type: Boolean,
    default: false,
  },
  earnings: {
    type: Number,
    default: 0,  // <-- Add this field
  },
});

module.exports = mongoose.model('Product', ProductSchema);
