// src/App.js
import React, { useState } from 'react'; // Add useState here
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage'; // Import your new components
import DateSelectionPage from './components/DateSelectionPage/DateSelectionPage';
import MapPage from './components/MapPage/MapPage';
import './App.css'; // Optional: Include global CSS styles

function App() {

  // State to store the user's zip code
  const [userZipCode, setUserZipCode] = useState('');

  // Handler function that gets called when the zip code is submitted
  const handleZipCodeSubmit = (zipCode) => {
    console.log('Zip code submitted:', zipCode);
    setUserZipCode(zipCode); // Save the zip code to state
    // You might also navigate to another route or perform an API call here
  };

  return (
    <Router>
      <div className="App">
        {/* Define routes for different pages */}
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