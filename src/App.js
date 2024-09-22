// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import IngredientsPage from './pages/IngredientsPage';
import SignInPage from './pages/SignInPage'; // Import SignInPage

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ingredients" element={<IngredientsPage />} />
        <Route path="/history" />
        <Route path="/contact"/>
        <Route path="/signin" element={<SignInPage />} /> {/* Add route for SignInPage */}
      </Routes>
    </Router>
  );
}

export default App;
