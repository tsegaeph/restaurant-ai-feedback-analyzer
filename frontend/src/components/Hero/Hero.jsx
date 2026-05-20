import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReservationModal from '../ReservationModal/ReservationModal';
import './Hero.css';

const Hero = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>

      <div className="container hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1>
            Experience Taste<br />
            <span>Like Never Before</span>
          </h1>

          <p className="hero-subtitle">
            Fresh ingredients. Modern flavors. Unforgettable moments crafted by culinary visionaries.
          </p>

          <div className="hero-buttons">
            <a href="#menu" className="btn-hero-primary">
              VIEW MENU
            </a>

            {/* 🔥 THIS NOW OPENS MODAL */}
            <button 
              className="btn-hero-secondary"
              onClick={() => setIsModalOpen(true)}
            >
              RESERVE A TABLE
            </button>
          </div>

        </motion.div>
      </div>

      {/* 🔥 Modal here */}
      <ReservationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </section>
  );
};

export default Hero;