// src/components/SignInPage.js
import React, { useState } from 'react';
import { auth } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import './SignInPage.css';

import { db } from '../firebase.js'; // Import Firestore (db)
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore methods


function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
  
      // Create user document in Firestore with empty favorites
      await setDoc(doc(db, 'users', userId), {
        favorites: [] // Initialize with an empty favorites array
      });
  
      console.log('Signed up as:', userCredential.user);
      setError(null);
      navigate('/'); // Redirect to homepage
    } catch (error) {
      setError(error.message); // Handle any errors during sign-up
    }
  };
  

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Signed in as:', userCredential.user);
        navigate('/');
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="sign-in-page">
      <div className="form-container">
        <h1 class="sign-in-title">You're one <span>munch</span> away.</h1>
        <p>Login now to save your recipes and more!</p>
        
        {error ? (
          <p className="error-message show">{error}</p>
        ) : (
          <p className="error-message"></p>  /* Keep the container but hidden */
        )}

        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="button-group">
          <button className="auth-button" onClick={handleSignIn}>Sign In</button>
          <button className="sign-up" onClick={handleSignUp}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
