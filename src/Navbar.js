import React, { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">websiet</div>
      <ul className="navbar-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#services">Services</a></li>
        <li className="dropdown">
          <button onClick={toggleDropdown} className="dropdown-toggle" aria-expanded={isDropdownOpen} aria-haspopup="true">
            More
          </button>
          <ul className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
