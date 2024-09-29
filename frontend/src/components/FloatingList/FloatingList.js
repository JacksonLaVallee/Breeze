import React, { useEffect, useState } from 'react';
import './FloatingList.css';
import PlaceDescription from '../PlaceDescription/PlaceDescription';

function FloatingList({ places, selectedPlace, onSelectPlace }) {
  // Create a state to store descriptions for each place
  const [descriptions, setDescriptions] = useState({});

  // Fetch the description for a place asynchronously
  const fetchDescription = async (placeName) => {
    try {
      const description = await PlaceDescription(placeName);
      setDescriptions((prevDescriptions) => ({
        ...prevDescriptions,
        [placeName]: description,
      }));
    } catch (error) {
      console.error("Error fetching description:", error);
    }
  };

  useEffect(() => {
    // Fetch descriptions for all places when component mounts
    places.forEach((place) => {
      if (!descriptions[place.name]) {
        fetchDescription(place.name);
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
