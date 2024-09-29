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
  const mapInstanceRef = useRef(null); // Store map instance separately
  const overlaysRef = useRef({}); // Store overlays separately to avoid re-creating them
  const [selectedPlace, setSelectedPlace] = useState(null); // Track the currently selected place

  useEffect(() => {
    if (window.google && mapRef.current && !mapInstanceRef.current) {
      // Initialize the Google Map only once
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
        mapTypeControl: false,  // Disable map type options
        streetViewControl: false,  // Disable street view control
        fullscreenControl: false,  // Disable fullscreen control
      });

      // Create markers and overlays
      places.forEach((place) => {
        // Create a standard marker
        const marker = new window.google.maps.Marker({
          position: { lat: place.latitude, lng: place.longitude },
          map: mapInstanceRef.current,
          title: place.name,
        });

        // Create a custom image overlay
        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'place-image-container';
        overlayDiv.innerHTML = `<img src="${place.imageUrl}" alt="${place.name}" class="place-image" style="width:100px; height:100px; border-radius:10px;" />`;
        overlayDiv.style.display = 'none'; // Initially hide all overlays
        overlayDiv.style.zIndex = '1000'; // Ensure overlays appear above the map

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
        overlay.onRemove = function () {
          overlayDiv.parentNode.removeChild(overlayDiv);
        };
        overlay.setMap(mapInstanceRef.current);

        // Store overlay and marker references in a dictionary
        overlaysRef.current[place.id] = { overlayDiv, marker, overlay };

        // Handle marker click to show overlay
        marker.addListener('click', () => {
          setSelectedPlace(place.id);
        });
      });
    }
  }, [places]); // Only run this effect once when the places data changes

  useEffect(() => {
    // Handle overlay visibility when selectedPlace changes
    Object.keys(overlaysRef.current).forEach((key) => {
      const { overlayDiv, overlay } = overlaysRef.current[key];
      if (overlayDiv) {
        overlayDiv.style.display = key == selectedPlace ? 'block' : 'none';

        // If the overlay for the selected place is being shown, trigger a redraw
        if (key === selectedPlace && overlay) {
          overlay.draw();
        }
      }
    });
  }, [selectedPlace]); // Re-run this effect only when selectedPlace changes

  // Handle clicking on a place in the list
  const handlePlaceClick = (placeId) => {
    setSelectedPlace(placeId); // Update the selected place state
    const selectedOverlay = overlaysRef.current[placeId];
    if (selectedOverlay && selectedOverlay.marker) {
      mapInstanceRef.current.setCenter(selectedOverlay.marker.getPosition());
    }
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
