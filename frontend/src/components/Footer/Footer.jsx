import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h2>NuovoFiore</h2>
          <p>Elevating the standard of modern dining through passion, craft, and technology.</p>
        </div>
        <div className="footer-links">
          <h4>LOCATION</h4>
          <p>Arada Giorgis<br/>Addis Ababa, Ethiopia</p>
          <a href="#" className="map-link">View on Maps &rarr;</a>
        </div>
        <div className="footer-links">
          <h4>OPENING HOURS</h4>
          <p>Mon - Thu: 5:00 PM - 10:00 PM<br/>Fri - Sun: 4:00 PM - 11:30 PM</p>
        </div>
        <div className="footer-links">
          <h4>CONNECT</h4>
          <div className="social-links">
            <a 
              href="https://instagram.com/tsega_00" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Instagram
            </a>

            <a 
              href="https://t.me/IDONHAVEAUSERNAME" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Telegram
            </a>

            <a 
              href="https://www.linkedin.com/in/tsegaephrem/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>

          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>  &copy; {new Date().getFullYear()} NuovoFiore Analytics & Dining • Built by Tsega Ephrem</p>
      </div>
    </footer>
  );
};

export default Footer;