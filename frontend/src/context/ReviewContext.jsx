import React, { createContext, useState, useEffect } from "react";
import { fetchReviews, fetchSummary, fetchInsights, analyzeReview } from "../services/api";

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState("");
  const [insights, setInsights] = useState({ top_problems: [], top_positives: [] });
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [revRes, sumRes, insRes] = await Promise.all([
        fetchReviews(),
        fetchSummary(),
        fetchInsights()
      ]);
      setReviews(revRes);
      setSummary(sumRes.summary);
      setInsights(insRes);
    } catch (error) {
      console.error("Dashboard load failed:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const addReview = async (text, rating) => {
    const newReview = await analyzeReview(text, rating);
    setReviews((prev) => [newReview, ...prev]); // Add to top
    
    // Silently refresh AI insights in background
    fetchSummary().then(res => setSummary(res.summary));
    fetchInsights().then(res => setInsights(res));
    
    return newReview;
  };

  return (
    <ReviewContext.Provider value={{ reviews, summary, insights, loading, addReview }}>
      {children}
    </ReviewContext.Provider>
  );
};