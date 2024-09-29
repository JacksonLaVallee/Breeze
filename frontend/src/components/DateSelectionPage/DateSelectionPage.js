// src/components/DateSelectionPage.js
import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DateSelectionPage.css'; // Import CSS for styling
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';

function DateSelectionPage() {
  const [availableDays, setAvailableDays] = useState([]); // Array to hold the next 7 days
  const [loading, setLoading] = useState(true); // Loading state for spinner
  const navigate = useNavigate();

  // Get weather icons (replace these URLs with your own images)
  const weatherIcons = {
    sunny: '../../weather-icons/sunny-day.png',
    cloudy: '../../weather-icons/cloudy.png',
    rainy: '../../weather-icons/rain.png',
    stormy: '../../weather-icons/stormy-cloud-with-rain-and-thunder.png',
    snowy: '../../weather-icons/snow.png',
  };

  const weatherBackgrounds = {
    sunny: process.env.PUBLIC_URL + '../../weather-icons/sunny-animation.gif',
    cloudy: process.env.PUBLIC_URL + '../../weather-icons/cloudy-animation.gif',
    rainy: process.env.PUBLIC_URL + '../../weather-icons/rainy-animation.gif',
    stormy: process.env.PUBLIC_URL + '../../weather-icons/stormy-animation.gif',
    snowy: process.env.PUBLIC_URL + '../../weather-icons/snowy-animation.gif',
  };

  const bgImage = process.env.PUBLIC_URL + '../weather-icons/outdoor1.jpg';
  const pageStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  // Function to fetch weather data and generate the next 7 days
  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://breeze-theta.vercel.app//find-weather');
      const weatherData = res.data;

      // Generate next 7 days using fetched weather data
      const today = new Date();
      const days = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        const dayOfWeek = date.toLocaleString('default', { weekday: 'short' });
        const dayOfMonth = date.getDate();
        const monthName = date.toLocaleString('default', { month: 'short' });
        const weather = weatherData[i];

        days.push({
          date: date.toISOString().split('T')[0],
          dayOfWeek,
          dayOfMonth,
          monthName,
          weather,
        });
      }

      setAvailableDays(days);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false); // Stop the spinner after fetching
    }
  };

  // Function to handle day click event
  const handleDayClick = async (selectedDay) => {
    try {
      // Send selected weather to the backend for activity filtering
      const response = await axios.post(`https://breeze-theta.vercel.app//set-weather?weather=${selectedDay.weather}`);
      const activities = response.data; // Get filtered activities from backend

      console.log('Filtered Activities:', activities);

      // Navigate to MapPage with detailed activity data
      navigate('/map', { state: { places: activities } });
    } catch (error) {
      console.error('Error fetching filtered activities:', error);
    }
  };

  // useEffect to set zip code, fetch weather data on component mount
  useEffect(() => {
    const initializeData = async () => {
      await fetchWeatherData(); // Fetch weather data after zip code is set
    };
    initializeData();
  }, []); // Re-fetch when the zip code changes

  return (
    <div className="date-selection-page" style={pageStyle}>
      {loading ? (
        <div className="spinner-container">
          <Spinner animation="border" variant="light" />
        </div>
      ) : (
        <>
          <h1>Select a Date</h1>
          <div className="calendar">
            {/* Render only the next 7 days */}
            {availableDays.map((day, index) => (
              <div
                key={index}
                className={`day ${day.weather}`}
                style={{
                  backgroundImage: `url(${weatherBackgrounds[day.weather]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                onClick={() => handleDayClick(day)} // Pass the day object to the click handler
              >
                <div className="day-of-week">{day.dayOfWeek}</div>
                <div className="day-number">
                  {day.monthName} {day.dayOfMonth}
                </div>
                <img src={weatherIcons[day.weather]} alt={day.weather} className="weather-icon" />
              </div>
            ))}
          </div>
        <button onClick={() => navigate(-1)} className="goBackZipButton">
        Choose a Different Zipcode
        </button>
        </>
      )}
    </div>
  );
}

export default DateSelectionPage;
