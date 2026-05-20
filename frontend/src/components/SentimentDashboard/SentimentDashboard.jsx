import React, { useContext } from 'react';
import { ReviewContext } from '../../context/ReviewContext';
import { motion } from 'framer-motion';
import './SentimentDashboard.css';

const SentimentDashboard = () => {
  const { reviews, summary, insights, loading } = useContext(ReviewContext);

  if (loading) return <div className="dashboard-loader">Syncing AI Intelligence...</div>;
  if (!reviews.length) return null;

  // Calculate stats
  const total = reviews.length;
  const posCount = reviews.filter(r => r.sentiment === 'POSITIVE').length;
  const neuCount = reviews.filter(r => r.sentiment === 'NEUTRAL').length;
  const posPercentage = Math.round((posCount / total) * 100) || 0;

  // Simple SVG Pie Chart paths (CSS Conic Gradient is alternative, but SVG is cleaner here)
  const getPieStyle = () => {
    const posDeg = (posCount / total) * 360;
    const neuDeg = (neuCount / total) * 360;
    return `conic-gradient(
      #2e7d32 0deg ${posDeg}deg, 
      #f57f17 ${posDeg}deg ${posDeg + neuDeg}deg, 
      #d32f2f ${posDeg + neuDeg}deg 360deg
    )`;
  };

  return (
    <div className="ai-dashboard">
      <div className="dashboard-header">
        <h2>AI Sentiment Analytics</h2>
        <span className="live-badge">● Live</span>
      </div>

      <div className="dashboard-grid">
        {/* Metric & Chart */}
        <motion.div className="dash-card stats-card" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}}>
          <div className="pie-chart" style={{ background: getPieStyle() }}></div>
          <div className="stats-info">
            <div className="stat">
              <span className="stat-value">{total}</span>
              <span className="stat-label">Total Reviews</span>
            </div>
            <div className="stat">
              <span className="stat-value text-green">{posPercentage}%</span>
              <span className="stat-label">Positive Feedback</span>
            </div>
          </div>
        </motion.div>

        {/* AI Summary Block */}
        <motion.div className="dash-card summary-card" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
          <h4>Performance Summary</h4>
          <p>{summary}</p>
        </motion.div>

        {/* AI Insights Grids */}
        <motion.div className="dash-card insights-card" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}}>
          <div className="insight-group">
            <h4 className="text-green">Highly Praised</h4>
            <div className="pill-container">
              {insights.top_positives.map((item, i) => (
                <span key={i} className="pill pill-positive">{item}</span>
              ))}
            </div>
          </div>
          <div className="insight-group mt-3">
            <h4 className="text-red">Areas for Improvement</h4>
            <div className="pill-container">
              {insights.top_problems.map((item, i) => (
                <span key={i} className="pill pill-negative">{item}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SentimentDashboard;