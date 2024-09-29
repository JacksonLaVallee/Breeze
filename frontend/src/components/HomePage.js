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

    // TODO
    // Use weather API to dynamically choose images (if its rainy, then show a rainy background image)

    setBgImage(bgUrl);
  }, []);

  return (
<<<<<<< HEAD
    <div className="home-page" style={{ textAlign: 'center', marginTop: '50px' }}>
      {/* Slides or content that you want to display */}
      <div className="slides">
        <div className="slide">
          <img src="file.png" alt="Welcome" />
          <h2>Welcome to Breeze</h2>
        </div>
        <div className="slide">
          <h2>Never Worry About Weather Again</h2>
        </div>
        <div className="slide">
          <h2>Click Here to Get Started</h2>
          {/* Add the "Get Started" button */}
          <button
            className="get-started-button"
            onClick={handleGetStarted} // Navigate to date-selection when clicked
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
          >
=======
    <div className="home-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="overlay">
        <div className="content">
          <h1 className="title">Welcome to Breeze</h1>
          <p className="subtitle">Discover things to do, no matter the weather.</p>
          <button className="get-started-button" onClick={handleGetStarted}>
>>>>>>> 2b407ef (updated homepage design)
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
