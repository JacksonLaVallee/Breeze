import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import DateSelectionPage from './components/DateSelectionPage/DateSelectionPage';
import MapPage from './components/MapPage/MapPage';
import './App.css';
import axios from 'axios';

function App() {

  const handleZipCodeSubmit = async (zipCode) => {
    console.log('Zip code submitted:', zipCode);
    await axios.post(`https://breeze-theta.vercel.app/set-zip?zipCode=${zipCode}`);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage onSubmitZipCode={handleZipCodeSubmit} />} /> {/* Homepage */}
          <Route path="/date-selection" element={<DateSelectionPage />} /> {/* Date Selection Page */}
          <Route path="/map" element={<MapPage />} /> {/* Map Page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;