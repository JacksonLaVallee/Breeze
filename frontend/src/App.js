// src/App.js
import React, { useState } from 'react';
import VisGoogleMapComponent from './components/VisGoogleMapComponent'; // Import the new Google Map component
import './App.css'; // Optional: Include your CSS styles

// This should be the format of JSON data with the recommended places
// This will be automatically generated by a function (to be implemented)
const samplePlaces = [
  { id: 1, name: 'Place 1', latitude: 36.165, longitude: -86.784 },
  { id: 2, name: 'Place 2', latitude: 36.167, longitude: -86.781 },
  { id: 3, name: 'Place 3', latitude: 36.162, longitude: -86.788 },
  { id: 4, name: 'Place 4', latitude: 36.169, longitude: -86.779 }
];

function App() {
  const [places, setPlaces] = useState(samplePlaces);
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={
          <>
          <h1>Breeze</h1>
          <p>Activity Recommender</p>
          {/* Render the Vis GL Google Map Component */}
          <VisGoogleMapComponent places={places}/>
          </>
        } />
        </Routes>

      </div>
    </Router>

  );
}

export default App;