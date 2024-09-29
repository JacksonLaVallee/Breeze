// src/components/DateSelectionPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DateSelectionPage.css'; // Import CSS for styling

function DateSelectionPage() {
  const [availableDays, setAvailableDays] = useState([]); // Array to hold the next 7 days
  const navigate = useNavigate();

  // Get weather icons (replace these URLs with your own images)
  const weatherIcons = {
    sunny: '/weather-icons/sunny-day.png',
    cloudy: '/weather-icons/cloudy.png',
    rainy: '/weather-icons/rain.png',
    stormy: '/weather-icons/stormy-cloud-with-rain-and-thunder.png',
    snowy: '/weather-icons/snow.png',
  };

  // Function to generate the next 7 days starting from today
  const generateNext7Days = () => {
    const today = new Date();
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(); // Create a new Date object based on today's date
      date.setDate(today.getDate() + i); // Increment date by 'i' days      
      const dayOfWeek = date.toLocaleString('default', { weekday: 'short' }); // Get short day name
      const dayOfMonth = date.getDate(); // Get day of the month
      const monthName = date.toLocaleString('default', { month: 'short' }); // Get short month name

      // Assign a random weather type to each day
      const weather = Object.keys(weatherIcons)[Math.floor(Math.random() * Object.keys(weatherIcons).length)];

      // Create day object and push it into the array
      days.push({
        date: date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        dayOfWeek,
        dayOfMonth,
        monthName,
        weather,
      });
    }
    setAvailableDays(days); // Set the state with the generated days
  };

  // Generate the next 7 days when the component mounts
  useEffect(() => {
    generateNext7Days();
  }, []);

  // Handle day click event
  const handleDayClick = (selectedDay) => {
    console.log(`Selected Day: ${selectedDay.date}`);
    // Navigate to the map page and pass the selected day as state
    navigate('/map', { state: { selectedDay } });
  };

  return (
    <div className="date-selection-page">
      <h1>Select a Date</h1>
      <div className="calendar">
        {/* Render only the next 7 days */}
        {availableDays.map((day, index) => (
          <div
            key={index}
            className="day"
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
    </div>
  );
}

export default DateSelectionPage;
