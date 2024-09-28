// src/components/VisGoogleMapComponent.js
import React, { useState } from 'react';
import { Map, Marker, APIProvider } from '@vis.gl/react-google-maps';

// Define container styles for the map
const containerStyle = {
  width: '100%',
  height: '500px', // Adjust the height as needed
};

// Define the initial center of the map
const center = {
  lat: 36.16449484460973, // Default latitude
  lng: -86.78347303808229, // Default longitude
};

function VisGoogleMapComponent() {
  const [mapRef, setMapRef] = useState(null);

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAllPS_API_KEY}>
     <div style={{height: "100vh"}}>
        <Map
        containerStyle={containerStyle}
        center={center}
        zoom={13}
        mapId={process.env.MAP_ID}
        onLoad={(map) => setMapRef(map)} // Set the map reference
        >
            {/* Example Marker */}
            <Marker position={center} />
        </Map>
     </div>
    </APIProvider>
  );
}

export default React.memo(VisGoogleMapComponent);
