import React from 'react';
import './MapPage.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import GoogleMapComponent from '../GoogleMapComponent/GoogleMapComponent';

function MapPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const places = location.state ? location.state.places : [];
  const zipCode = location.state ? location.state.zipCode : '60612';

  return (
    <div>
      <GoogleMapComponent places={places} zipCode={zipCode} />
      <button onClick={() => navigate(-1, { state: { zipCode } })} className="goBackDateButton">
        Choose a Different Date
      </button>
    </div>
  );
}

export default MapPage;