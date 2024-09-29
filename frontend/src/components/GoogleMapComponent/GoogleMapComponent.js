import React, { useEffect, useRef, useState } from 'react';
import FloatingList from '../FloatingList/FloatingList'; // Import the FloatingList component
import './GoogleMapComponent.css'; // Import custom CSS for styling
import axios from 'axios';

// Default center of the map
const defaultCenter = {
  lat: 36.16449484460973,
  lng: -86.78347303808229,
};

function GoogleMapComponent({ places = [] }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null); // Store map instance separately
  const overlaysRef = useRef({}); // Store overlays separately to avoid re-creating them
  const [selectedPlace, setSelectedPlace] = useState(null); // Track the currently selected place
  const [center, setCenter] = useState(defaultCenter); // State to track the center of the map

  // Fetch the zip code and convert to coordinates using Google Geocoding API
  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        // Fetch the zip code from the backend
        const response = await axios.get('http://localhost:8080/get-zip');
        const zipCode = response.data;

        // Fetch coordinates using the zip code from Google Geocoding API
        const geoResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=AIzaSyCocc-1XF4aJSLYk3mMSyoQqhipLpf9NLo`
        );
        console.log('geoResponse:', geoResponse.data);

        if (geoResponse.data.results.length > 0) {
          const location = geoResponse.data.results[0].geometry.location;
          setCenter({ lat: location.lat, lng: location.lng }); // Update the center of the map
        } else {
          console.error('Failed to fetch coordinates from the zip code');
        }
      } catch (error) {
        console.error('Error fetching coordinates from backend or Google Geocoding API:', error);
      }
    };

    fetchCoordinates();
  }, []); // Run only once on component mount

  // Initialize Google Map and add markers and overlays when `center` changes
  useEffect(() => {
    if (window.google && mapRef.current) {
      if (!mapInstanceRef.current) {
        // Initialize the Google Map if it has not been initialized yet
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: center, // Use the updated center state
          zoom: 13,
          mapTypeControl: false, // Disable map type options
          streetViewControl: false, // Disable street view control
          fullscreenControl: false, // Disable fullscreen control
        });
      } else {
        // Update the map center if it has already been initialized
        mapInstanceRef.current.setCenter(center);
      }
    }
  }, [center]); // Re-run this effect whenever the `center` state changes

  useEffect(() => {
    if (mapInstanceRef.current) {
      // Clear existing overlays and markers
      Object.values(overlaysRef.current).forEach(({ overlayDiv, overlay }) => {
        overlayDiv.parentNode && overlayDiv.parentNode.removeChild(overlayDiv);
        overlay.setMap(null);
      });
      overlaysRef.current = {};

      // Create new markers and overlays for the provided places
      places.forEach((place) => {
        // Create a standard marker
        const marker = new window.google.maps.Marker({
          position: { lat: place.location.lat, lng: place.location.lng },
          map: mapInstanceRef.current,
          title: place.name,
        });

        // Create a custom image overlay
        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'place-image-container';
        overlayDiv.innerHTML = `<img src="${place.photoUrl}" alt="${place.name}" class="place-image" />`;
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
          const position = projection.fromLatLngToDivPixel(new window.google.maps.LatLng(place.location.lat, place.location.lng));
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
  }, [places]); // Re-run this effect whenever the `places` data changes

  // Handle overlay visibility when selectedPlace changes
  useEffect(() => {
    Object.keys(overlaysRef.current).forEach((key) => {
      const { overlayDiv, overlay } = overlaysRef.current[key];
      if (overlayDiv) {
        overlayDiv.style.display = key === selectedPlace ? 'block' : 'none';

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
