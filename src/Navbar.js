import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for the li.dropdown
  const dropdownMenuRef = useRef(null); // Ref for the ul.dropdown-menu

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const menuElement = dropdownMenuRef.current;
    const dropdownContainer = dropdownRef.current;

    if (isDropdownOpen && menuElement && dropdownContainer) {
      // Reset alignment classes first to measure natural position
      menuElement.classList.remove('dropdown-menu-align-right');
      
      // Ensure styles are applied and dimensions are readable
      // Reading offsetWidth can help force a reflow if needed, but usually getBoundingClientRect is sufficient.
      // menuElement.offsetWidth; 

      const menuRect = menuElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Check if the parent li.dropdown is close to the right edge
      // We use the parent .dropdown's position as the menu is positioned relative to it.
      const parentRect = dropdownContainer.getBoundingClientRect();

      // If the menu (centered by default: parent left + parent width/2 - menu width/2) overflows right
      // A simpler check: if the right edge of the parent is too close to viewport edge,
      // and the menu is wider than the remaining space on its right.
      // Or, more directly, if menuRect.right (after temporary render) overflows.
      // The menuRect.right calculation depends on its current styling (left: 50%, transform: translateX(-50%)).
      // If parentRect.right + menuRect.width / 2 > viewportWidth (rough estimate if centered)
      // A more robust way after it's made visible (but before final paint)
      
      // Calculate where the right edge of the menu would be if it were centered
      // The menu's `left` is 50% of parent, `transform` makes its own center align with that 50% mark.
      // So, its actual left is parentRect.left + parentRect.width / 2 - menuRect.width / 2
      const calculatedLeft = parentRect.left + (parentRect.width / 2) - (menuRect.width / 2);
      const calculatedRight = calculatedLeft + menuRect.width;

      if (calculatedRight > viewportWidth - 10) { // 10px buffer
        menuElement.classList.add('dropdown-menu-align-right');
      } else {
        // Ensure it's not trying to align right if it doesn't need to
        menuElement.classList.remove('dropdown-menu-align-right');
      }

    } else if (menuElement) {
      // Cleanup when dropdown is closed
      menuElement.classList.remove('dropdown-menu-align-right');
    }
  }, [isDropdownOpen]);


  return (
    <nav className="navbar">
      <div className="navbar-logo">websiet</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/clock">Clock</Link></li>
        <li><Link to="/calculator">Calculator</Link></li>
        <li className="dropdown" ref={dropdownRef}> {/* Attach ref to li.dropdown */}
          <button onClick={toggleDropdown} className="dropdown-toggle" aria-expanded={isDropdownOpen} aria-haspopup="true">
            More
          </button>
          <ul className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`} ref={dropdownMenuRef}> {/* Attach ref to ul.dropdown-menu */}
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
