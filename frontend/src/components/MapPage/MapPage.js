// src/components/MapPage.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import GoogleMapComponent from '../GoogleMapComponent/GoogleMapComponent';

function MapPage() {
  const location = useLocation();
  const [places, setPlaces] = useState([]);
  const placeIds = location.state ? location.state.placeIds : []; // Assume place IDs are passed in the state

  useEffect(() => {
    // Function to fetch place details using Google Places API
    const fetchPlaceDetails = async (placeIds) => {
      // Create a new PlacesService object using a dummy div and the Google map instance
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));

      const placeDetailsPromises = placeIds.map((placeId) => {
        return new Promise((resolve, reject) => {
          const request = { placeId };
          service.getDetails(request, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              // Extract necessary details
              resolve({
                id: place.place_id,
                name: place.name,
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng(),
                imageUrl: place.photos ? place.photos[0].getUrl({ maxWidth: 400 }) : '', // Get the first photo if available
                rating: place.rating || 'N/A',
                price: place.price_level ? '$'.repeat(place.price_level) : 'N/A',
                description: place.types ? place.types.join(', ') : 'No description available',
              });
            } else {
              reject(`Failed to fetch details for place ID: ${placeId}`);
            }
          });
        });
      });

      try {
        const fetchedPlaces = await Promise.all(placeDetailsPromises);
        setPlaces(fetchedPlaces);
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    };

    if (placeIds.length > 0) {
      // Fetch place details only if placeIds array is not empty
      fetchPlaceDetails(placeIds);
    }
  }, [placeIds]);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Map Page</h1>
      {/* Render the map component with the fetched places */}
      <GoogleMapComponent places={places} />
    </div>
  );
}

export default MapPage;
