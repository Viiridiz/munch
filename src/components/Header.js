import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // You don't need useNavigate for scroll
import './Header.css';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import logo from '../assets/traydark.png';
import LogoutModal from './LogoutModal'; // Import the modal

function Header({ ingredientsRef, recipeContainerRef, favoritedRecipesRef }) {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal state

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

  const handleScrollToSection = (ref, offset = 220) => (e) => {  // Default offset of 100px for the navbar
    e.preventDefault();
    if (ref.current) {
      const elementPosition = ref.current.getBoundingClientRect().top + window.pageYOffset; // Get the section's position relative to the page
      const offsetPosition = elementPosition - offset;  // Adjust for navbar height
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
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
            <li><Link to="/" onClick={handleScrollToTop}>Home</Link></li>
            <li><Link onClick={handleScrollToSection(favoritedRecipesRef)}>Saved</Link></li>  {/* Changed to button */}
            <li><Link onClick={handleScrollToSection(ingredientsRef)}>Create</Link></li>  {/* Changed to button */}
            <li><Link onClick={handleScrollToSection(recipeContainerRef)}>Recipes</Link></li>  {/* Changed to button */}
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
