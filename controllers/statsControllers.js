const Product = require('../models/Product');
const Order = require('../models/Order'); // optional

exports.getSellerStats = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const totalProducts = await Product.countDocuments({ seller: sellerId });

    const pendingOrders = await Order.countDocuments({ seller: sellerId, status: 'Pending' });

    const earningsData = await Order.find({ seller: sellerId, status: 'Completed' });
    const earnings = earningsData.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({ totalProducts, pendingOrders, earnings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
