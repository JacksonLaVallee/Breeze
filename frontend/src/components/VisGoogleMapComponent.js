// src/components/VisGoogleMapComponent.js
import React, { useState } from 'react';
import { Map, Marker, InfoWindow, APIProvider } from '@vis.gl/react-google-maps';

// Define container styles for the map
const containerStyle = {
  width: '100%',
  height: '500px',
};

// Initial center of map (Downtown Nashville)
const defaultCenter = {
  lat: 36.16449484460973,
  lng: -86.78347303808229,
};

function VisGoogleMapComponent({ places = [] }) {
  const [mapRef, setMapRef] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div style={{ height: '100vh' }}>
        <Map
          containerStyle={containerStyle}
          center={places.length ? { lat: places[0].latitude, lng: places[0].longitude } : defaultCenter}
          zoom={13}
          mapId={process.env.REACT_APP_MAP_ID}
          onLoad={(map) => setMapRef(map)} // Set the map reference
        >
          {places.map((place, index) => (
            <Marker
              key={index}
              position={{ lat: place.latitude, lng: place.longitude }}
              title={place.name}
              onClick={() => setSelectedPlace(place)} // Set the selected place on click
            />
          ))}

          {/* Display the InfoWindow if a place is selected */}
          {selectedPlace && (
            <InfoWindow
              position={{ lat: selectedPlace.latitude, lng: selectedPlace.longitude }}
              onCloseClick={() => setSelectedPlace(null)} // Close the InfoWindow when clicked
            >
              <div style={{ textAlign: 'center' }}>
                <h4>{selectedPlace.name}</h4>
                <img
                  src={selectedPlace.imageUrl} // Add image URL from place object
                  alt={selectedPlace.name}
                  style={{ width: '200px', height: '200px' }} // Set image size
                />
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}

export default React.memo(VisGoogleMapComponent);
