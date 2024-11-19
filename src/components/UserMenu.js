import React, { useState, useEffect } from 'react';
import {db } from '../firebase'; // Ensure Firestore is imported
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import './UserMenu.css'; // Add styles for the user menu

const UserMenu = ({ user, onLogout, setUsernameInHeader }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [username, setUsername] = useState('');
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isNightMode, setIsNightMode] = useState(false);
  
    useEffect(() => {
      if (user) {
        const fetchUserData = async () => {
          const userDoc = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const fetchedUsername = data.username || '';
            setUsername(fetchedUsername);
            setIsNightMode(data.nightMode || false);
  
            // Update the header with the username
            setUsernameInHeader(fetchedUsername);
          }
        };
        fetchUserData();
      }
    }, [user, setUsernameInHeader]);
  
    const toggleMenu = () => setShowMenu(!showMenu);
  
    const handleSaveUsername = async () => {
      if (user && username.trim() !== '') {
        const userDoc = doc(db, 'users', user.uid);
        await updateDoc(userDoc, { username });
        setIsEditingUsername(false);
  
        // Update the header with the new username
        setUsernameInHeader(username);
      }
    };
  
    const toggleNightMode = async () => {
      setIsNightMode(!isNightMode);
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        await updateDoc(userDoc, { nightMode: !isNightMode });
      }
      document.body.classList.toggle('night-mode', !isNightMode);
    };
  
    return (
      <div className="user-menu">
        <span onClick={toggleMenu}>Welcome, {username || user.email}</span>
        {showMenu && (
          <div className="user-menu-dropdown">
            <div className="user-details">
                <p><strong>Email: </strong>{user.email}</p>
              {!isEditingUsername ? (
                <p>
                  <strong>Username:</strong> {username || 'Not set'}{' '}
                  <button onClick={() => setIsEditingUsername(true)}>Edit</button>
                </p>
              ) : (
                <div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                  <button onClick={handleSaveUsername}>Save</button>
                </div>
              )}
            </div>
            <button className="logout-button" onClick={onLogout}>
              Log Out
            </button>
            <div className="user-settings">
              <label>
                <input
                  type="checkbox"
                  checked={isNightMode}
                  onChange={toggleNightMode}
                />
                Night Mode
              </label>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default UserMenu;
  