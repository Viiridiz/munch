// src/pages/HomePage.js
import React from 'react';
import playstoreImg from '../assets/playstore.png';
import appstoreImg from '../assets/appstore.png';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div class="homepage">

      <div class="top-panel">

        <div class="caption-box">
          <h1>Home of your<br></br>next <span>munch.</span></h1>
          <p>Begin your culinary journey with munch and help <span>save 70% of wasted foods.</span></p>
          <Link to="/ingredients"><a>Get Started Now</a></Link>
        </div>
      
      </div>


    </div>

  );
}

<div className="right-panel">
      <div className="start-recipe">
      <div className="review">
        
      <h2>Helping over 3M+ Home-Cooks</h2>
  
      <div className="star-rating">
        <svg className="star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg className="star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg className="star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg className="star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg className="star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </div>
      <p className="organization-name">Allrecipes</p>

      <div className="star-rating">
        <svg className="star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg className="star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg className="star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <svg className="star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </div>
      <p className="organization-name">Vanity</p>

    </div>

    <div className="store-buttons">
      <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
        <img src={playstoreImg} alt="Google Play" />
      </a>
      <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
        <img src={appstoreImg} alt="App Store" />
      </a>
    </div>
      </div>
    </div>

export default HomePage;
