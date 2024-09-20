// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/traydark.png'; // Assuming your logo is in the assets folder

function Header() {
  return (
    <header>
      <nav>
        <div className="logo-container">
          <img src={logo} alt="MUNCH logo" className="logo" />
          <h1>munch.</h1>
        </div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/ingredients">Create</Link></li>
          <li><Link to="/history">History</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        <h2>Get Started</h2>
      </nav>
    </header>
  );
}

export default Header;
