import React, { useRef } from 'react';
import Header from '../components/Header';
import IngredientsComponent from '../components/IngredientsComponent';
import './HomePage.css';

function HomePage() {
  const ingredientsRef = useRef(null);

  const handleScrollToIngredients = (e) => {
    e.preventDefault();  // Prevent the default link behavior
    if (ingredientsRef.current) {
      ingredientsRef.current.scrollIntoView({ behavior: 'smooth' });  // Scroll smoothly to ingredients section
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
            {/* Update the 'Get Started Now' link to trigger scroll */}
            <a href="/" onClick={handleScrollToIngredients}>Get Started Now</a>
          </div>
        </div>
        
        {/* Ingredients section */}
        <div ref={ingredientsRef}>
          <IngredientsComponent />
        </div>
      </div>
    </>
  );
}

export default HomePage;
