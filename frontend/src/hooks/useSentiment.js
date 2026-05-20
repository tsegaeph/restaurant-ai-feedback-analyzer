import { useState } from 'react';
import { analyzeSentiment } from '../services/api';

export const useSentiment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSentiment = async (text, rating, author) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeSentiment(text, rating, author);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to analyze sentiment');
      setIsLoading(false);
      return null;
    }
  };

  return { getSentiment, isLoading, error };
};