import React from 'react';
import './Footer.css';

function Footer() {
  // Get current year dynamically
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>© {currentYear} websiet. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
