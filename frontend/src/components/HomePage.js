// src/components/HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Import the CSS file for styles

function HomePage() {
  const [bgImage, setBgImage] = useState(''); // State for the dynamic background image
  const navigate = useNavigate();

  // Handle navigation to the date selection page
  const handleGetStarted = () => {
    navigate('/date-selection');
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
          <button className="get-started-button" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
