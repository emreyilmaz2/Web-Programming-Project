import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/rented-vehicles">Araçlarım</Link></li>
        <li><Link to="/list-vehicle">Araç İlanı Ver</Link></li>
        {isAuthenticated ? (
          <li><button onClick={handleLogout}>Logout</button></li>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
