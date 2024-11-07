import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../components/CSS/home.css'; // Importing the CSS file for styling
import placeholder from '../../src/assets/placeholder.png';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Decode userId from authToken cookie
    const token = Cookies.get('authToken'); // Get token from cookies

    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token
        setUserId(decoded.id); // Set userId from the decoded token
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

  // Function to fetch cart items from the API
  const fetchCart = async () => {
    if (userId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        setCart(response.data.products);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }
  };

  // Fetch cart items when the component mounts or userId changes
  useEffect(() => {
    fetchCart();
  }, [userId]);

  // Function to add product to the cart via API
  const handleAddToCart = async (product) => {
    try {
      await axios.post('http://localhost:5000/api/cart/add', {
        userId: userId,
        productId: product._id,
      });
      fetchCart(); // Re-fetch the cart after adding the product
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  // Function to increase the quantity of a product in the cart
  const handleIncreaseQuantity = async (productId) => {
    await handleAddToCart({ _id: productId });
  };

  // Function to decrease the quantity of a product in the cart
  const handleDecreaseQuantity = async (productId) => {
    const cartItem = cart.find((item) => item.product._id === productId);
    if (cartItem && cartItem.quantity > 1) {
      try {
        await axios.post('http://localhost:5000/api/cart/decrease', {
          userId,
          productId,
        });
        fetchCart(); // Re-fetch the cart after decreasing quantity
      } catch (error) {
        console.error('Error decreasing product quantity:', error);
      }
    } else {
      // If the quantity is 1, remove the item from the cart
      try {
        await axios.delete(`http://localhost:5000/api/cart/${userId}/product/${productId}`);
        fetchCart(); // Re-fetch the cart after removing the product
      } catch (error) {
        console.error('Error removing product from cart:', error);
      }
    }
  };

  return (
    <div className="products-container">
      <h1>Products</h1>
      <div className="product-grid">
        {products.map((product) => {
          // Find the product in the cart to manage the button states
          const cartItem = cart.find((item) => item.product._id === product._id);
          const quantity = cartItem ? cartItem.quantity : 0;

          return (
            <div key={product._id} className="product-card">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="product-image"
                onError={(e) => (e.target.src = placeholder)}
              />
              <div className="product-info">
                <h2>{product.title}</h2>
                <p>By {product.author}</p>
                <p className="price">₹{product.price}</p>
                {quantity === 0 ? (
                  <button className="add-to-cart" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </button>
                ) : (
                  <div className="quantity-controls">
                    <button onClick={() => handleDecreaseQuantity(product._id)}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => handleIncreaseQuantity(product._id)}>+</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
