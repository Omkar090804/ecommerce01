import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import placeholder from '../../src/assets/placeholder.png';
import "../components/CSS/cartView.css"; // Importing the CSS file for styling

const CartView = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userId, setUserId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // Default payment method
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  // Fetch the cart for the logged-in user
  const fetchCart = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_BASE_URL + `api/cart/${userId}`);
      setCartItems(response.data.products);
      calculateTotal(response.data.products);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Function to calculate total price for all products
  const calculateTotal = (items) => {
    let total = 0;
    items.forEach(item => {
      total += item.product.price * item.quantity;
    });
    setTotalPrice(total);
  };

  // Function to increase the quantity
  const handleIncreaseQuantity = async (productId) => {
    try {
      await axios.post(process.env.REACT_APP_BASE_URL + 'api/cart/add', {
        userId,
        productId,
      });
      fetchCart(); // Refresh cart after update
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };

  // Function to decrease the quantity
  const handleDecreaseQuantity = async (productId) => {
    const cartItem = cartItems.find(item => item.product._id === productId);
    if (cartItem && cartItem.quantity > 1) {
      try {
        await axios.post(process.env.REACT_APP_BASE_URL + 'api/cart/decrease', {
          userId,
          productId,
        });
        fetchCart(); // Refresh cart after update
      } catch (error) {
        console.error('Error decreasing quantity:', error);
      }
    } else {
      // If quantity is 1, remove the product from the cart
      handleRemoveProduct(productId);
    }
  };

  // Function to remove a product from the cart
  const handleRemoveProduct = async (productId) => {
    try {
      await axios.delete(process.env.REACT_APP_BASE_URL + `api/cart/${userId}/product/${productId}`);
      fetchCart(); // Refresh cart after removal
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  // Function to handle checkout modal
  const handleCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  // Function to submit the order
  const handleOrderSubmit = async () => {
    try {
      const orderDetails = {
        user: userId,
        products: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        totalAmount: totalPrice,
        paymentMethod: paymentMethod,
      };

      // Send the order details to the backend
      await axios.post( process.env.REACT_APP_BASE_URL + 'api/orders', orderDetails);

      // Clear the cart and close modal
      setCartItems([]);
      setIsCheckoutModalOpen(false);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place the order');
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.product._id} className="cart-item">
              <img
                src={item.product.imageUrl}
                alt={item.product.title}
                className="cart-item-image"
                onError={(e) => (e.target.src = placeholder)}
              />
              <div className="cart-item-info">
                <h3>{item.product.title}</h3>
                <p>Price: ₹{item.product.price.toFixed(2)}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Total: ₹{(item.product.price * item.quantity).toFixed(2)}</p>
                <div className="quantity-controls">
                  <button onClick={() => handleDecreaseQuantity(item.product._id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncreaseQuantity(item.product._id)}>+</button>
                </div>
                <button onClick={() => handleRemoveProduct(item.product._id)} className="remove-button">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {cartItems.length > 0 && (
        <div className="cart-summary">
          <h3>Total Price: ₹{totalPrice.toFixed(2)}</h3>
          <button onClick={handleCheckout} className="checkout-button">
            Proceed to Checkout
          </button>
        </div>
      )}

      {isCheckoutModalOpen && (
        <div className="checkout-modal">
          <h3>Select Payment Method</h3>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash
            </label>
            <label>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Card
            </label>
          </div>
          <button onClick={handleOrderSubmit} className="submit-order-button">
            Submit Order
          </button>
          <button onClick={() => setIsCheckoutModalOpen(false)} className="cancel-button">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default CartView;