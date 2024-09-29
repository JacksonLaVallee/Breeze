// src/components/HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Import the CSS file for styles

function HomePage({ onSubmitZipCode }) {
  const [bgImage, setBgImage] = useState(''); // State for the dynamic background image
  const [zipCode, setZipCode] = useState(''); // State to store the user's zip code input
  const navigate = useNavigate();

  // Handle navigation to the date selection page
  const handleGetStarted = () => {
    navigate('/date-selection');
  };

  // Handle the zip code submission
  const handleZipCodeSubmit = async (event) => {
    event.preventDefault();
    if (zipCode.match(/^\d{5}(-\d{4})?$/)) {
      await onSubmitZipCode(zipCode);
      navigate('/date-selection', { state: { zipCode }}); // Optionally navigate after successful submission
    } else {
      alert("Please enter a valid zip code.");
    }
  };

  // Change background image based on time of day or weather conditions
  useEffect(() => {
    const currentHour = new Date().getHours();
    let bgUrl = 'https://www.mtnscoop.com/media/images/2020/05/shutterstock_1188687490-1024x535.jpg';

    // TODO: Use weather API to dynamically choose images (if it's rainy, show a rainy background image)
    setBgImage(bgUrl);
  }, []);

  return (
    <div className="home-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="overlay">
        <div className="content">
          <h1 className="title">Welcome to Breeze</h1>
          <p className="subtitle">Discover things to do, no matter the weather.</p>
          <div className="zip-code-form-container">
            <form onSubmit={handleZipCodeSubmit} className="zip-code-form">
              <input
                type="text"
                className="zip-code-input"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter your zip code"
                pattern="\d{5}(-\d{4})?"
                required
              />
              <button type="submit" className="zip-code-submit-button">
                →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
