import React from 'react';
import './LogoutModal.css';

const LogoutModal = ({ onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-contentlogin">
        <h2>Are you sure you want to log out?</h2>
        <div className="modal-buttons">
          <button className="confirm-button" onClick={onConfirm}>Yes</button>
          <button className="cancel-button" onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
