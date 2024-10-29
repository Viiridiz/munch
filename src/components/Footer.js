import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} MUNCH. All rights reserved.</p>
      <p>
        Akeyla Mashka Shareef
      </p>
    </footer>
  );
};

export default Footer;
