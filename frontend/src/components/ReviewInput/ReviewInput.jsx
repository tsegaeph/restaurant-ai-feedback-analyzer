import React, { useState, useContext } from 'react';
import { useSentiment } from '../../hooks/useSentiment';
import { ReviewContext } from '../../context/ReviewContext';
import Loader from '../Loader/Loader';
import './ReviewInput.css';

const ReviewInput = () => {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5); // New state for stars
  const { getSentiment, isLoading } = useSentiment();
  const { addReview } = useContext(ReviewContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !name.trim()) return;

    // Send text and rating to backend via useSentiment hook
    // Note: Updated hook now accepts (text, rating)
    const result = await getSentiment(text, rating, name);
    
    if (result) {
      addReview(result);
      setName('');
      setText('');
      setRating(5); // Reset to default
    }
  };

  return (
    <div className="review-input-box">
      <h3>Leave a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>YOUR NAME</label>
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>RATING</label>
          <div className="star-rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star} 
                className={`star-icon ${star <= rating ? 'active' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>YOUR THOUGHTS</label>
          <textarea 
            placeholder="Tell us about your experience..." 
            rows="5"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn-submit" disabled={isLoading}>
          {isLoading ? <Loader /> : 'POST REVIEW'}
        </button>
      </form>
    </div>
  );
};

export default ReviewInput;