import React from 'react';
import { motion } from 'framer-motion';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  // Map backend labels to CSS classes
  const sentimentClass = review.sentiment?.toLowerCase() || 'neutral';

  return (
    <motion.div 
      className="review-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
    >
      <div className="review-card-header">
        <div className="review-stars">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < review.rating ? "star-gold" : "star-muted"}>
              ★
            </span>
          ))}
        </div>
        <span className={`sentiment-badge ${sentimentClass}`}>
          {review.sentiment}
        </span>
      </div>

      <p className="review-body">"{review.text}"</p>

      <div className="review-card-footer">
        <div className="review-author">
          <span className="author-name">{review.author || "Anonymous"}</span>
          <span className="review-date">
            {new Date(review.timestamp || Date.now()).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }).toUpperCase()}
          </span>
        </div>
        {review.confidence && (
          <div className="ai-meta">
            AI Confidence: {(review.confidence * 100).toFixed(0)}%
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReviewCard;