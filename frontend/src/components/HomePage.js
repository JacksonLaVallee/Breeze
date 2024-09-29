// src/components/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Optional: Include CSS specific to this component

function HomePage() {
  const navigate = useNavigate(); // Create a navigate function using React Router

  const handleGetStarted = () => {
    // Navigate to the date selection page
    navigate('/date-selection');
  };

  return (
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
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//     <title>Breeze</title>
//     <link rel="stylesheet" href="style.css" />
//   </head>
//   <body>
//     <div class="Container">
//       <div class="slides slide1">
//         <img src="../public/file.png">
//         <h2>Welcome to Breeze</h2>
//       </div>
//       <div class="slides slide2">
//         <h2>Never Worry About Weather Again</h2>
//       </div>
//       <div class="slides slide3">
//         <h2>Click Here to Get Started</h2>
//       </div>
//       <div id="root"></div>

//     </div>

//   </body>
//   </html>

