import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReviewContext } from '../../context/ReviewContext';
import ReviewCard from '../ReviewCard/ReviewCard';
import ReviewInput from '../ReviewInput/ReviewInput';
import SentimentDashboard from '../SentimentDashboard/SentimentDashboard';
import './ReviewSection.css';

const ReviewSection = () => {
  const { reviews } = useContext(ReviewContext);
  const [showAI, setShowAI] = useState(false);

  // 🔥 NEW: loading state for UX
  const [loading, setLoading] = useState(true);

  const [visibleCount, setVisibleCount] = useState(3);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  // 🔥 simulate backend wake-up / fetch delay handling
  useEffect(() => {
    if (reviews && reviews.length >= 0) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1200); // small delay = better UX feel
      return () => clearTimeout(timer);
    }
  }, [reviews]);

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

          <div className="review-cards-column">

            {/* 🔥 LOADING STATE */}
            {loading ? (
              <div className="loading-state">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  🔄 Connecting to AI server...
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Preparing restaurant insights...
                </motion.p>
              </div>
            ) : reviews.length === 0 ? (
              <p>No reviews yet. Be the first to share your experience!</p>
            ) : (
              <div className="cards-wrapper">

                {[...reviews].reverse().slice(0, visibleCount).map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}

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