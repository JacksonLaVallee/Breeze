// src/components/MapPage/MapPage.js
import React from 'react';
import './MapPage.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import GoogleMapComponent from '../GoogleMapComponent/GoogleMapComponent';

function MapPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const places = location.state ? location.state.places : []; // Receive the detailed places data

  return (
    <div>
      <GoogleMapComponent places={places} />
      <button onClick={() => navigate(-1)} className="goBackDateButton">
      Choose a Different Date
    </button>
    </div>
  );
}

export default MapPage;
