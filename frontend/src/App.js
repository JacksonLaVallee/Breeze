// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage'; // Import your new components
import DateSelectionPage from './components/DateSelectionPage';
import MapPage from './components/MapPage';
import './App.css'; // Optional: Include global CSS styles

function App() {
  return (
    <Router>
      <div className="App">
        {/* Define routes for different pages */}
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Homepage */}
          <Route path="/date-selection" element={<DateSelectionPage />} /> {/* Date Selection Page */}
          <Route path="/map" element={<MapPage />} /> {/* Map Page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;