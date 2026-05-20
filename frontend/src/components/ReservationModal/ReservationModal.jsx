import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ReservationModal.css';

const ReservationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Confirming reservation and opening payment gateway...");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div 
          className="modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
        >
          <button className="modal-close" onClick={onClose}>&times;</button>
          
          <div className="modal-header">
            <h2>Reserve Your Table</h2>
            <p>Experience fine dining at its best.</p>
          </div>

          <form onSubmit={handleSubmit} className="reservation-form">
            <div className="form-group">
              <label>Date</label>
              <input type="date" required className="modal-input" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Time</label>
                <input type="time" required className="modal-input" />
              </div>
              <div className="form-group">
                <label>Guests</label>
                <input type="number" min="1" max="12" defaultValue="2" className="modal-input" />
              </div>
            </div>

            <button type="submit" className="btn-confirm">
              Confirm & Proceed to Payment
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReservationModal;