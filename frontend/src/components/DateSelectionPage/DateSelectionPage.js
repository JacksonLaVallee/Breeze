// src/components/DateSelectionPage.js
import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DateSelectionPage.css'; // Import CSS for styling
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';

function DateSelectionPage() {
  const [availableDays, setAvailableDays] = useState([]); // Array to hold the next 7 days
  const [loading, setLoading] = useState(true);
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
  
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true); // Start the spinner before fetching data
        const res = await axios.get('http://localhost:8080/find-weather');
        // Assuming the response contains an array of weather data for 7 days
        const weatherData = res.data;
        generateNext7Days(weatherData); // Pass weather data to the generator function
      } catch (error) {
        console.error('Error fetching weather data:', error);
        // Handle error here, e.g., set an error state
      } finally {
        setLoading(false); // Stop the spinner after fetching
      }
    };

    fetchWeatherData();
  }, []);
  
  // Function to generate the next 7 days starting from today
  const generateNext7Days = async () => {
    try {
      const today = new Date();
      const days = [];

      // Fetch weather data from the backend
      const weatherData = (await axios.get('http://localhost:8080/find-weather')).data;

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

      setAvailableDays(days); // Set the state with the generated days
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  // Function to fetch initial activities from the backend based on zip code
  const fetchInitialActivities = async () => {
    try {
      // Fetch activities from the backend instead of Google Places API
      const response = await axios.get(`http://localhost:8080/find-activities?zipCode=${zipCode}&radius=10`);
      const placeIds = response.data || [];

      // Store initial place IDs in the state
      setInitialActivityPlaceIds(placeIds);

      console.log('Initial Place IDs:', placeIds);
    } catch (error) {
      console.error('Error fetching initial activities from backend:', error);
    }
  };

  useEffect(() => {
    generateNext7Days();
    fetchInitialActivities(); // Fetch initial activities on component mount
  }, [zipCode]); // Re-fetch activities when the zip code changes

  // Handle day click event and post data to the backend for filtering
  const handleDayClick = async (selectedDay) => {
    try {
      // Send selected date, weather, and initial activity place IDs to the backend for filtering
      const response = await axios.post('http://localhost:8080/filter-activities', {
        selectedDate: selectedDay.date,
        weather: selectedDay.weather,
        placeIds: initialActivityPlaceIds,
      });

      // Get the filtered place IDs from the backend and navigate to the MapPage with those IDs
      const filteredPlaceIds = response.data;
      console.log('Filtered Place IDs:', filteredPlaceIds);

      navigate('/map', { state: { placeIds: filteredPlaceIds } });
    } catch (error) {
      console.error('Error filtering activities:', error);
    }
  };

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
                backgroundPosition: 'center'
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
        </>
      )}
    </div>
  );
}

export default DateSelectionPage;
