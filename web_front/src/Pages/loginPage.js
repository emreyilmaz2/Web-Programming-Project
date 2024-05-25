import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../Services/api';
import './loginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login/', { email, password });
      if (response.status === 200) {
        const data = response.data;
        console.log('Login successful:', data);
        localStorage.setItem('token', data.access);
        login();
        navigate('/home');
      } else {
        console.error('Login failed');
        alert('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="Email">Email:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            autoComplete="false"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        <button type="button" onClick={handleRegister} className="register-button">Register</button>
      </form>
    </div>
  );
};

export default LoginPage;