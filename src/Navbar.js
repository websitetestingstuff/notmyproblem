import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const dropdownRef = useRef(null); // Ref for the li.dropdown
  const dropdownMenuRef = useRef(null); // Ref for the ul.dropdown-menu

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close the "More" dropdown if it's open when the mobile menu is toggled
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  // Close mobile menu if window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const menuElement = dropdownMenuRef.current;
    const dropdownContainer = dropdownRef.current;

    if (isDropdownOpen && menuElement && dropdownContainer) {
      requestAnimationFrame(() => {
        // Reset alignment classes first to measure natural position
        menuElement.classList.remove('dropdown-menu-align-right');
        
        // Ensure styles are applied and dimensions are readable.
        // Reading offsetWidth can help force a reflow if needed, but usually getBoundingClientRect
        // inside requestAnimationFrame is sufficient.
        // menuElement.offsetWidth; 

        const menuRect = menuElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        // Check if the parent li.dropdown is close to the right edge
        // We use the parent .dropdown's position as the menu is positioned relative to it.
        const parentRect = dropdownContainer.getBoundingClientRect();
        
        // Calculate where the right edge of the menu would be if it were centered
        // The menu's default CSS: left: 50%; transform: translateX(-50%);
        // Its actual left is parentRect.left + (parentRect.width / 2) - (menuRect.width / 2)
        const calculatedLeft = parentRect.left + (parentRect.width / 2) - (menuRect.width / 2);
        const calculatedRight = calculatedLeft + menuRect.width;

        if (calculatedRight > viewportWidth - 10) { // 10px buffer
          menuElement.classList.add('dropdown-menu-align-right');
        } else {
          // Ensure it's not trying to align right if it doesn't need to
          menuElement.classList.remove('dropdown-menu-align-right');
        }
      });
    } else if (menuElement) {
      // Cleanup when dropdown is closed
      // No need for requestAnimationFrame here as it's becoming hidden
      menuElement.classList.remove('dropdown-menu-align-right');
    }
  }, [isDropdownOpen, dropdownMenuRef, dropdownRef]); // Added refs to dependency array as per React best practices, though not strictly necessary for this logic if refs themselves don't change.


  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">websiet</Link>
      </div>

      <button className="hamburger-menu" onClick={toggleMobileMenu} aria-expanded={isMobileMenuOpen} aria-label="Toggle navigation">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`navbar-links ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <li><Link to="/" onClick={isMobileMenuOpen ? toggleMobileMenu : undefined}>Home</Link></li>
        <li><Link to="/clock" onClick={isMobileMenuOpen ? toggleMobileMenu : undefined}>Clock</Link></li>
        <li><Link to="/calculator" onClick={isMobileMenuOpen ? toggleMobileMenu : undefined}>Calculator</Link></li>
        <li><Link to="/stopwatch" onClick={isMobileMenuOpen ? toggleMobileMenu : undefined}>Stopwatch</Link></li>
        <li><Link to="/typetest" onClick={isMobileMenuOpen ? toggleMobileMenu : undefined}>Type Test</Link></li>
        <li><Link to="/image-interaction" onClick={isMobileMenuOpen ? toggleMobileMenu : undefined}>Image Fun</Link></li>
        <li className="dropdown" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="dropdown-toggle" aria-expanded={isDropdownOpen} aria-haspopup="true">
            More
          </button>
          <ul className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`} ref={dropdownMenuRef}>
            <li><a href="#about" onClick={() => { if (isMobileMenuOpen) toggleMobileMenu(); setIsDropdownOpen(false);}}>About Us</a></li>
            <li><a href="#contact" onClick={() => { if (isMobileMenuOpen) toggleMobileMenu(); setIsDropdownOpen(false);}}>Contact</a></li>
            <li><a href="#faq" onClick={() => { if (isMobileMenuOpen) toggleMobileMenu(); setIsDropdownOpen(false);}}>FAQ</a></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
