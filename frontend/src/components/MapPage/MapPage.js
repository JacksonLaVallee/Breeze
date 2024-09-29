// src/components/MapPage/MapPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import GoogleMapComponent from '../GoogleMapComponent/GoogleMapComponent';

function MapPage() {
  const location = useLocation();
  const places = location.state ? location.state.places : []; // Receive the detailed places data

  return (
    <div>
      <GoogleMapComponent places={places} />
    </div>
  );
}

export default MapPage;
