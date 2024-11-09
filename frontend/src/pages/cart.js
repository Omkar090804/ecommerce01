import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import CartView from '../components/cartView';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

const Cart = () => {

  const [user, setUser] = useState(null); // State to store user info

  useEffect(() => {
    // Function to get the token and decode it
    const getUserFromToken = () => {
      const token = Cookies.get('authToken'); // Get token from cookies
      if (token) {
        try {
          // Decode the token to get the user data
          const decodedToken = jwtDecode(token);
          setUser(decodedToken); // Set the user data in state
          console.log('Decoded User:', decodedToken);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    };

    getUserFromToken(); // Call the function to extract user data
  }, []);


  return(
    <div>
      <Navbar user={user} />
      <CartView/>
      <Footer/>
    </div>
  )
};


export default Cart;
