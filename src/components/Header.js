  import React, { useEffect, useState } from 'react';
  import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
  import './Header.css';
  import { auth } from '../firebase';
  import { signOut } from 'firebase/auth';
  import logo from '../assets/traydark.png';
  import LogoutModal from './LogoutModal';
  
  function Header({ ingredientsRef, recipeContainerRef, favoritedRecipesRef }) {
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false); // Modal state
    const navigate = useNavigate();  // Initialize navigate
    const location = useLocation();  // Get the current location
    const isActive = (path) => location.pathname === path;

    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
      const handleScroll = () => {
        const sections = [
          { id: 'home', ref: null },
          { id: 'saved', ref: favoritedRecipesRef },
          { id: 'create', ref: ingredientsRef },
          { id: 'recipes', ref: recipeContainerRef },
        ];
    
        let currentSection = 'home'; // Default section
        sections.forEach((section) => {
          if (
            section.ref &&
            section.ref.current &&
            section.ref.current.getBoundingClientRect().top <= 270 // Offset with buffer
          ) {
            currentSection = section.id;
          }
        });
    
        setActiveSection(currentSection);
      };
    
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [favoritedRecipesRef, ingredientsRef, recipeContainerRef]);
    

  
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
  
    const scrollToSection = (ref, offset = 220) => {
      if (ref.current) {
        const elementPosition = ref.current.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    };
  
    const handleNavigationAndScroll = (ref, offset = 220) => (e) => {
      e.preventDefault();
      if (location.pathname !== '/') {
        navigate('/', { state: { scrollTo: ref, offset } });  // Pass the scroll ref and offset through state
      } else {
        scrollToSection(ref, offset);  // Scroll directly if already on the homepage
      }
    };

    const handleNavigationAndScrollIngredients = (ref) => (e) => {
      e.preventDefault();
      if (location.pathname !== '/') {
        // Navigate to homepage and pass scroll ref for ingredients
        navigate('/', { state: { scrollToIngredients: ref } });
      } else {
        // Scroll directly if already on homepage
        scrollToIngredients(ref)(e); // Pass the event here
      }
    };
    
    const scrollToIngredients = (ref) => (e) => { 
      e.preventDefault();  // Ensure the event is passed
      if (ref.current) {
        const elementPosition = ref.current.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth',
        });
      }
    };
    
  
    const handleScrollToTop = (e) => {
      e.preventDefault();
      if (location.pathname !== '/') {
        navigate('/');  // Navigate to homepage first
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
            <li>
              <Link
                to="/"
                onClick={handleScrollToTop}
                className={activeSection === 'home' ? 'active' : ''}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                onClick={handleNavigationAndScroll(favoritedRecipesRef)}
                className={activeSection === 'saved' ? 'active' : ''}
              >
                Saved
              </Link>
            </li>
            <li>
              <Link
                onClick={handleNavigationAndScrollIngredients(ingredientsRef)}
                className={activeSection === 'create' ? 'active' : ''}
              >
                Create
              </Link>
            </li>
            <li>
              <Link
                onClick={handleNavigationAndScroll(recipeContainerRef)}
                className={activeSection === 'recipes' ? 'active' : ''}
              >
                Recipes
              </Link>
            </li>


            </ul>
          </div>
  
          <div className="auth-container">
            {user ? (
              <span onClick={handleLogoutClick}>{user.email} (Sign Out)</span>
            ) : (
              <span><Link to="/signin">Sign In</Link></span>
            )}
          </div>
        </nav>
  
        {showModal && (
          <LogoutModal
            onClose={() => setShowModal(false)} 
            onConfirm={handleSignOut} 
          />
        )}
      </header>
    );
  }
  
  export default Header;
  