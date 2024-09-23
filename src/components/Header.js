import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Add useNavigate
import './Header.css';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import logo from '../assets/traydark.png';

function Header({ ingredientsRef }) {  // Accept ingredientsRef as a prop
  const [user, setUser] = useState(null);
  const navigate = useNavigate();  // Initialize navigate

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

  const handleScrollToIngredients = (e) => {
    e.preventDefault();  // Prevent default link behavior
    if (ingredientsRef.current) {
      ingredientsRef.current.scrollIntoView({ behavior: 'smooth' });  // Scroll smoothly to ingredients section
    }
    navigate('/');  // Optional: navigate to the home route
  };

  const handleScrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <li><a href="/" onClick={handleScrollToTop}>Home</a></li>
            {/* Change Create link to trigger the scroll */}
            <li><a href="/" onClick={handleScrollToIngredients}>Create</a></li>
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
