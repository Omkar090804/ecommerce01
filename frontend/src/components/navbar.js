import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import Cookies to handle cookie deletion
import '../components/CSS/home.css'; // We'll define the CSS below
import logo from '../assets/sitlogo.png';

const Navbar = ({user}) => {
  const navigate = useNavigate(); // Use navigate hook to programmatically navigate

  // Function to handle logout
  const handleLogout = () => {
    // Delete the authToken cookie
    Cookies.remove('authToken');
    
    // Optionally navigate to the login page or home page after logout
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="Book Store Logo" className="logo" />
        <h1 className="brand-name">Book Store: SIT Pune</h1>
      </div>
      <ul className="nav-links">
        <li>Welcome, {user?.name}</li>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/login" onClick={handleLogout}>Logout</Link></li> {/* Call handleLogout on click */}
      </ul>
    </nav>
  );
};

export default Navbar;
