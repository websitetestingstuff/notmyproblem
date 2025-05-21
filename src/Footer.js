import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} NotMyProblem. All rights reserved.</p>
      <p>
        <a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Service</a>
      </p>
    </footer>
  );
}

export default Footer;
