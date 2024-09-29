// src/components/FloatingList.js
import React from 'react';
import './FloatingList.css';

function FloatingList({ places, selectedPlace, onSelectPlace }) {
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
            <p className="place-description">{place.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FloatingList;
