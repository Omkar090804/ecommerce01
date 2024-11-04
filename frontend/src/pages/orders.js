import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import placeholder from '../../src/assets/placeholder.png';
import "../components/CSS/ordersView.css"; // Assuming you have an Orders-specific CSS
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);

  // Decode JWT to get user ID
  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

  // Fetch orders for the logged-in user
  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const fetchOrders = async () => {
    try {
      console.log(userId)
      const response = await axios.get(`http://localhost:5000/api/orders/${userId}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  
  return (
    <div>
      <Navbar />

      <div className="orders-container">
            <h2>Your Orders</h2>
            {orders.length === 0 ? (
            <p>You have no orders.</p>
            ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order._id} className="order-item">
                  {/* Product Details */}
                  <div className="order-products">
                    {order.products.map(item => (

                      <div key={item.product._id} className="order-product">
                        <img
                          src={item.product.imageUrl || placeholder}
                          alt={item.product.title}
                          className="order-product-image"
                          onError={(e) => (e.target.src = placeholder)}
                        />
                        <div className="order-product-info">
                          <h4>{item.product.title}</h4>
                          <p>Price: ${item.product.price.toFixed(2)}</p>
                          <p>Quantity: {item.quantity}</p>
                          <p>Subtotal: ${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                        </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="order-details">
                    <h3>Order #{order._id}</h3>

                    <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
                    <p>Payment Method: {order.paymentMethod}</p>
                    <p>Status: {order.status}</p>
                    <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
    </div>
  );
}  

export default Orders;
