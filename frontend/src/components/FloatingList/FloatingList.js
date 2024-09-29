import React, { useEffect, useState } from 'react';
import './FloatingList.css';
import axios from 'axios';
import PlaceDescription from '../PlaceDescription/PlaceDescription';

function FloatingList({ places, selectedPlace, onSelectPlace }) {
  // Create a state to store descriptions for each place
  const [descriptions, setDescriptions] = useState({});

  // Fetch the description for a place asynchronously
  const fetchDescription = async (place) => {
    try {
      //get zip code of current place
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${place.location.lat},${place.location.lng}&key=AIzaSyCocc-1XF4aJSLYk3mMSyoQqhipLpf9NLo`);
      const address = response.data.results[0].formatted_address;
      const description = await PlaceDescription(place.name, address);
      setDescriptions((prevDescriptions) => ({
        ...prevDescriptions,
        [place.name]: description,
      }));
    } catch (error) {
      console.error("Error fetching description:", error);
    }
  };

  useEffect(() => {
    // Fetch descriptions for all places when component mounts
    places.forEach((place) => {
      if (!descriptions[place.name]) {
        fetchDescription(place);
      }
    });
  }, [places]);

  return (
    <div className="floating-list">
      {places.map((place) => (
        <div
          key={place.id}
          className={`place-item ${selectedPlace === place.id ? 'active' : ''}`}
          onClick={() => onSelectPlace(place.id)}
        >
          <img src={place.photoUrl} alt={place.name} className="place-thumbnail" />
          <div className="place-details">
            <h3>{place.name}</h3>
            <div className="place-meta">
              <span className="place-rating">⭐ {place.rating}</span>
              <span className="place-price">{place.price}</span>
            </div>
            {/* Display the description if it has been fetched */}
            <p className="place-description">
              {descriptions[place.name] ? descriptions[place.name] : 'Loading description...'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FloatingList;
