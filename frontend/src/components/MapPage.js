// src/components/MapPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import VisGoogleMapComponent from './VisGoogleMapComponent'; // Import your map component

function MapPage() {
  const location = useLocation();
  const preferences = location.state ? location.state.preferences : {};

  // Sample places for demonstration purposes
  const samplePlaces = [
    {
      id: 1,
      name: 'Place 1',
      latitude: 36.165,
      longitude: -86.784,
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'Place 2',
      latitude: 36.167,
      longitude: -86.781,
      imageUrl: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Map Page</h1>
      <p style={{ textAlign: 'center' }}>
        Showing activities for the selected preferences: {JSON.stringify(preferences)}
      </p>
      {/* Render the map component with sample places */}
      <VisGoogleMapComponent places={samplePlaces} />
    </div>
  );
}

export default MapPage;
