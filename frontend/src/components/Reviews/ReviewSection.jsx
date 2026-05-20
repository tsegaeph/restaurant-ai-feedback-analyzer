import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReviewContext } from '../../context/ReviewContext';
import ReviewCard from '../ReviewCard/ReviewCard';
import ReviewInput from '../ReviewInput/ReviewInput';
import SentimentDashboard from '../SentimentDashboard/SentimentDashboard';
import './ReviewSection.css'; 

const ReviewSection = () => {
  const { reviews } = useContext(ReviewContext);
  const [showAI, setShowAI] = useState(false); 
  
  // --- LOAD MORE LOGIC ---
  // Start by showing only 3 reviews
  const [visibleCount, setVisibleCount] = useState(3);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  return (
    <section id="reviews" className="review-section">
      <div className="container">
        
        <div className="review-header">
          <h2>Guest Experiences</h2>
          <button 
            className="btn-analyze" 
            onClick={() => setShowAI(!showAI)}
          >
            {showAI ? "Close AI Analytics" : "✨ Analyze Reviews with AI"}
          </button>
        </div>

        <AnimatePresence>
          {showAI && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 40 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="ai-dashboard-wrapper"
            >
              <SentimentDashboard />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="review-content">
          {/* Right Column: The Review Cards */}
          <div className="review-cards-column">
            {reviews.length === 0 ? (
              <p>No reviews yet. Be the first to share your experience!</p>
            ) : (
              <div className="cards-wrapper">
                {/* We reverse to show newest first, then slice to visibleCount */}
                {[...reviews].reverse().slice(0, visibleCount).map((review) => (
                  <ReviewCard key={review.id || Math.random()} review={review} />
                ))}
                
                {/* Only show button if there are more reviews to see */}
                {visibleCount < reviews.length && (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-load-more"
                    onClick={handleLoadMore}
                  >
                    View More Reviews
                  </motion.button>
                )}
              </div>
            )}
          </div>

          <div className="review-input">
            <ReviewInput />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;