import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import logo from '../assets/traydark.png';
import LogoutModal from './LogoutModal'; // Import the modal

function Header({ ingredientsRef }) {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal state
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log('User signed out');
      setShowModal(false); // Close modal after logout
      window.location.reload(); // Refresh the page
    });
  };

  const handleScrollToIngredients = (e) => {
    e.preventDefault();
    if (ingredientsRef.current) {
      ingredientsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    navigate('/');
  };

  const handleScrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutClick = () => {
    setShowModal(true); // Show the modal
  };

  return (
    <header>
      <nav>
        <div className="logo-container">
          <img src={logo} alt="MUNCH logo" className="logo" onClick={handleScrollToTop} />
          <h1><Link to="/" onClick={handleScrollToTop}>munch.</Link></h1>
        </div>

        <div className="nav-links-container">
          <ul>
            <li><Link to="/"><a href="/" onClick={handleScrollToTop}>Home</a></Link></li>
            <li><a href="/" onClick={handleScrollToIngredients}>Create</a></li>
            <li><Link to="/history">History</Link></li>
          </ul>
        </div>

        <div className="auth-container">
          {user ? (
            <span onClick={handleLogoutClick}>{user.email} (Sign Out)</span>  // Trigger modal
          ) : (
            <span><Link to="/signin">Sign In</Link></span>
          )}
        </div>
      </nav>

      {/* Show the modal if showModal is true */}
      {showModal && (
        <LogoutModal
          onClose={() => setShowModal(false)} // Close modal if "No" is clicked
          onConfirm={handleSignOut} // Confirm logout if "Yes" is clicked
        />
      )}
    </header>
  );
}

export default Header;
