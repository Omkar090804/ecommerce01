const express = require('express');
const Cart = require('../models/cart'); // Assuming you've created a Cart model
const Product = require('../models/product'); // Assuming you've created a Product model
const router = express.Router();

// Get all cart items for a specific user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('products.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}); 

// Add or update a product in the cart
router.post('/add', async (req, res) => {
  const { userId, productId } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // If no cart exists, create a new cart for the user
      cart = new Cart({ user: userId, products: [] });
    }

    const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

    if (productIndex > -1) {
      // If product already exists in the cart, increment the quantity by 1
      cart.products[productIndex].quantity += 1;
    } else {
      // Otherwise, add the new product to the cart with quantity 1
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save(); // Save the updated cart
    res.json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Decrease quantity of a product in the cart
router.post('/decrease', async (req, res) => {
  const { userId, productId } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

    if (productIndex > -1) {
      if (cart.products[productIndex].quantity > 1) {
        // If quantity is greater than 1, just decrease it
        cart.products[productIndex].quantity -= 1;
      } else {
        // If quantity is 1, remove the product from the cart
        cart.products.splice(productIndex, 1);
      }

      await cart.save(); // Save the updated cart
      res.json({ message: 'Product quantity decreased', cart });
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    console.error('Error decreasing product quantity:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Remove a product from the cart
router.delete('/:userId/product/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter(item => item.product.toString() !== productId);
    await cart.save();

    res.json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.error('Error removing product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Clear the entire cart
router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOneAndDelete({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
