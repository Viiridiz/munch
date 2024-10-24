import React, { useRef, useEffect} from 'react';
import Header from '../components/Header';
import IngredientsComponent from '../components/IngredientsComponent';
import { useLocation } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const ingredientsRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Check if state contains scroll instructions and ensure ref is passed
    if (location.state && location.state.scrollToIngredients) {
      const ref = location.state.scrollToIngredients;
      
      // Introduce a delay to ensure full page load
      const delayScroll = setTimeout(() => {
        scrollToSection(ref);
      }, 300); // Adjust delay if needed

      return () => clearTimeout(delayScroll); // Cleanup timeout if component unmounts
    }
  }, [location]);

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      const elementPosition = ref.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <Header ingredientsRef={ingredientsRef} /> {/* Pass ingredientsRef as a prop */}
      <div className="homepage">
        <div className="top-panel">
          <div className="caption-box">
            <h1>Home of your<br />next <span>munch.</span></h1>
            <p>Begin your culinary journey with munch and help <span>save 70% of wasted foods.</span></p>
          </div>
        </div>
        
        {/* Ingredients section */}
        <div>
          <IngredientsComponent />
        </div>
      </div>
    </>
  );
}

export default HomePage;
