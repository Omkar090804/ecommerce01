import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../components/CSS/login.css'; // Importing the CSS file for styling
import sitlogo from '../../src/assets/sitlogo.png'; // Placeholder image

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // useEffect to check for authToken and redirect to home if it exists
  useEffect(() => {
    const token = Cookies.get('authToken'); // Check for authToken cookie
    if (token) {
      console.log('Token found, redirecting to home page');
      navigate('/home'); // Redirect to home if token exists
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(process.env.REACT_APP_BASE_URL + 'api/users/login', { email, password });
      if (response.data.isOK) {
        console.log('Login successful:', response.data.token);
        Cookies.set('authToken', response.data.token, { expires: 30 }); // Store the token in cookies
        navigate('/home'); // Redirect to home after successful login
      } else {
        console.log('Login failed: Incorrect email or password');
        alert("Incorrect email or password!");
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const redirectSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src={sitlogo} alt="Login"/>
        <p className="image-text">SIT Book Store</p>
      </div>
      <div className="login-form-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="login-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
          <button type="button" onClick={redirectSignUp} className="signup-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
