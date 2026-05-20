import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="container about-container">
        <motion.div 
          className="about-image-wrapper"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <img src="https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Chef preparing food" className="about-image" />
          <div className="experience-badge">
            <span className="years">12+</span>
            <span className="text">YEARS OF EXCELLENCE</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="about-text"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="subtitle">OUR STORY</span>
          <h2>A Symphony of Culinary Excellence</h2>
          <p>
            Founded in 2012, FlavorNest was born from a simple yet profound vision: to elevate the dining experience through meticulous attention to detail and an unwavering commitment to quality.
          </p>
          <p>
            Our chefs believe that cooking is an art form. We source our ingredients exclusively from local heritage farms, ensuring every flavor profile is authentic, vibrant, and sustainable.
          </p>
          <div className="signature">
            <h4>Julian Vane</h4>
            <span>EXECUTIVE CHEF</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;