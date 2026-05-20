import React, { useState } from 'react'; 
import './Navbar.css';

const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container nav-container">

        <div className="logo">FlavorNest</div>

        {/* Hamburger */}
        <div 
          className="hamburger" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        <ul className={menuOpen ? "nav-links active" : "nav-links"}>
          <li><a href="#about" onClick={() => setMenuOpen(false)}>ABOUT</a></li>
          <li><a href="#menu" onClick={() => setMenuOpen(false)}>MENU</a></li>
          <li><a href="#reviews" onClick={() => setMenuOpen(false)}>REVIEWS</a></li>
          <li><a href="#reservations" onClick={() => setMenuOpen(false)}>RESERVATIONS</a></li>
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;