import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h2>FlavorNest</h2>
          <p>Elevating the standard of modern dining through passion, craft, and technology.</p>
        </div>
        <div className="footer-links">
          <h4>LOCATION</h4>
          <p>123 Culinary Avenue<br/>Metropolis, NY 10012</p>
          <a href="#" className="map-link">View on Maps &rarr;</a>
        </div>
        <div className="footer-links">
          <h4>OPENING HOURS</h4>
          <p>Mon - Thu: 5:00 PM - 10:00 PM<br/>Fri - Sun: 4:00 PM - 11:30 PM</p>
        </div>
        <div className="footer-links">
          <h4>CONNECT</h4>
          <div className="social-links">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FlavorNest Analytics & Dining. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;