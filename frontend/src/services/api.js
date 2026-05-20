import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const analyzeSentiment = async (text, rating, author) => {
  const res = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, rating, author}), 
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to analyze sentiment");
  }
  return res.json();
};

export const analyzeReview = async (text, rating, author) => {
  const res = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, rating , author}),
  });
  if (!res.ok) throw new Error("Failed to submit review");
  return res.json();
};

export const fetchReviews = async () => {
  const res = await fetch(`${API_URL}/reviews`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

export const fetchSummary = async () => {
  const res = await fetch(`${API_URL}/summary`);
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
};

export const fetchInsights = async () => {
  const res = await fetch(`${API_URL}/insights`);
  if (!res.ok) throw new Error("Failed to fetch insights");
  return res.json();
};