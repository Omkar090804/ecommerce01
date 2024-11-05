import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../components/CSS/signup.css'; // Make sure this path is correct

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/signup', { username, email, password });
      alert('User created');
      navigate('/login');
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2 className="signup-title">Signup</h2>
        <form onSubmit={handleSignup} className="signup-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
