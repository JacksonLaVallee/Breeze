// src/components/VisGoogleMapComponent.js
import React, { useState } from 'react';
import { Map, Marker, APIProvider } from '@vis.gl/react-google-maps';
import './VisGoogleMapComponent.css'; // Import custom CSS for styling

// Define container styles for the map
const containerStyle = {
  width: '100%',
  height: '100vh', // Make the map take up the full height of the screen
};

// Initial center of map (Downtown Nashville)
const defaultCenter = {
  lat: 36.16449484460973,
  lng: -86.78347303808229,
};

function VisGoogleMapComponent({ places = [] }) {
  const [mapRef, setMapRef] = useState(null);

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div style={{ height: '100vh' }}>
        <Map
          containerStyle={containerStyle}
          center={places.length ? { lat: places[0].latitude, lng: places[0].longitude } : defaultCenter}
          zoom={13}
          mapId={process.env.REACT_APP_MAP_ID} // Ensure the Map ID is correct in the environment variables
          onLoad={(map) => setMapRef(map)} // Set the map reference
        >
          {/* Render all markers and their corresponding images */}
          {places.map((place, index) => (
            <React.Fragment key={index}>
              {/* Standard Marker */}
              <Marker
                position={{ lat: place.latitude, lng: place.longitude }}
                title={place.name}
              />

              {/* Custom HTML Image Container */}
              <div
                className="place-image-container"
                style={{
                  position: 'absolute',
                  transform: `translate(${place.latitude}px, ${place.longitude}px)`, // Adjust based on map position
                  width: '150px', // Set width of image container
                  left: `${place.longitude}px`, // Set the left position based on the longitude
                  top: `${place.latitude}px`, // Set the top position based on the latitude
                }}
              >
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="place-image"
                />
              </div>
            </React.Fragment>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}

export default React.memo(VisGoogleMapComponent);
