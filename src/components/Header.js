import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import logo from '../assets/traydark.png';

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log('User signed out');
    });
  };

  return (
    <header>
      <nav>
        <div className="logo-container">
          <img src={logo} alt="MUNCH logo" className="logo" />
          <h1><Link to="/">munch.</Link></h1>
        </div>

        <div className="nav-links-container">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/ingredients">Create</Link></li>
            <li><Link to="/history">History</Link></li>
          </ul>
        </div>

        <div className="auth-container">
          {user ? (
            <span onClick={handleSignOut}>{user.email} (Sign Out)</span>
          ) : (
            <span><Link to="/signin">Sign In</Link></span>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
