// src/components/SignInPage.js
import React, { useState } from 'react';
import { auth } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import './SignInPage.css';

function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Signed up as:', userCredential.user);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
      });
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
