// Chart.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './Chart.css';

const ChartComponent = ({ reviews }) => {
  const data = [
    { name: 'Positive', value: reviews.filter(r => r.sentiment === 'POSITIVE').length, color: '#C8A45D' },
    { name: 'Neutral', value: reviews.filter(r => r.sentiment === 'NEUTRAL').length, color: '#e0e0e0' },
    { name: 'Negative', value: reviews.filter(r => r.sentiment === 'NEGATIVE').length, color: '#F44336' },
  ].filter(d => d.value > 0);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const positiveRatio = total > 0 ? Math.round((data.find(d => d.name === 'Positive')?.value || 0) / total * 100) : 0;

  return (
    <div className="chart-wrapper">
      <div className="chart-center-label">
        <span className="percent">{positiveRatio}%</span>
        <span className="label">POSITIVE</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="chart-legend">
        {data.map((entry, index) => (
          <div key={index} className="legend-item">
            <span className="dot" style={{ backgroundColor: entry.color }}></span>
            {entry.name.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ChartComponent;