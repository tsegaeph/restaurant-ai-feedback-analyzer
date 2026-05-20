// App.jsx
import React from 'react';
import Home from './pages/Home';
import { ReviewProvider } from './context/ReviewContext';
import './styles/global.css';

function App() {
  return (
    <ReviewProvider>
      <Home />
    </ReviewProvider>
  );
}
export default App;