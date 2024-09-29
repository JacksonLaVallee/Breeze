// src/components/GoogleMapComponent/GoogleMapComponent.js
import React, { useEffect, useRef, useState } from 'react';
import FloatingList from '../FloatingList/FloatingList'; // Import the new FloatingList component
import './GoogleMapComponent.css'; // Import custom CSS for styling

// Initial center of the map (Downtown Nashville)
const defaultCenter = {
  lat: 36.16449484460973,
  lng: -86.78347303808229,
};

function GoogleMapComponent({ places = [] }) {
  const mapRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null); // Track the currently selected place

  useEffect(() => {
    if (window.google && mapRef.current) {
      // Initialize the Google Map
      const map = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
      });

      // Store all overlays in a ref to control their visibility
      const overlays = {};

      // Add markers and custom image overlays
      places.forEach((place) => {
        // Create a standard marker
        const marker = new window.google.maps.Marker({
          position: { lat: place.latitude, lng: place.longitude },
          map: map,
          title: place.name,
        });

        // Create a custom image overlay
        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'place-image-container';
        overlayDiv.innerHTML = `<img src="${place.imageUrl}" alt="${place.name}" class="place-image" />`;
        overlayDiv.style.display = 'none'; // Initially hide all overlays

        // Create an overlay on the map using the `OverlayView` method
        const overlay = new window.google.maps.OverlayView();
        overlay.onAdd = function () {
          const panes = this.getPanes();
          panes.overlayLayer.appendChild(overlayDiv);
        };
        overlay.draw = function () {
          const projection = this.getProjection();
          const position = projection.fromLatLngToDivPixel(new window.google.maps.LatLng(place.latitude, place.longitude));

          // Position the overlay
          overlayDiv.style.left = position.x + 'px';
          overlayDiv.style.top = position.y + 'px';
          overlayDiv.style.position = 'absolute';
        };
        overlay.setMap(map);

        // Store overlay in a dictionary with the place id as the key
        overlays[place.id] = overlayDiv;

        // Handle marker click to show overlay
        marker.addListener('click', () => {
          setSelectedPlace(place.id);
        });
      });

      // Show the selected overlay and hide others
      if (selectedPlace) {
        Object.keys(overlays).forEach((key) => {
          overlays[key].style.display = key === selectedPlace ? 'block' : 'none';
        });
      }
    }
  }, [places, selectedPlace]);

  // Handle clicking on a place in the list
  const handlePlaceClick = (placeId) => {
    setSelectedPlace(placeId); // Update the selected place state
  };

  return (
    <div className="map-layout">
      {/* Floating List Overlay */}
      <FloatingList places={places} selectedPlace={selectedPlace} onSelectPlace={handlePlaceClick} />

      {/* Map container to render the Google Map */}
      <div ref={mapRef} className="map-container" />
    </div>
  );
}

export default React.memo(GoogleMapComponent);
