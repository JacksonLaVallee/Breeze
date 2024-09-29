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
  const currentZipCode = location.state ? location.state.zipCode : '60612'; // Use zip code from state or default

  return (
    <div>
      <GoogleMapComponent places={places} />
      <button 
        onClick={() =>
          navigate(-1, {
            state: { zipCode: currentZipCode }, // Pass the current zip code back as state
          })
        }
        className="goBackDateButton">
      Choose a Different Date
    </button>
    </div>
  );
}

export default MapPage;
