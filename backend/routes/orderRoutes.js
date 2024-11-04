const express = require('express');
const Order = require('../models/order');
const Cart = require('../models/cart');

const router = express.Router();

// Create an order
router.post('/', async (req, res) => {
  try {
    // Extract the order details from the request body
    const { user, products, totalAmount, paymentMethod } = req.body;

    // Create a new order object
    const newOrder = new Order({
      user,
      products,
      totalAmount,
      paymentMethod,
      status: 'pending',  // Add a status field if you need to track order status
      createdAt: Date.now()
    });

    // Save the order to the database
    await newOrder.save();

    await Cart.findOneAndUpdate(
      { user: user },
      { $set: { products: [] } },  // Clear the cart
      { new: true }
    );

    // Respond to the client with a success message
    res.status(201).json({ message: 'Order created successfully', orderId: newOrder._id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all orders for a specific user
router.get('/:userId', async (req, res) => {

  const { userId } = req.params;
  
  try {
    const orders = await Order.find({ user: userId }).populate('products.product');
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = router;
