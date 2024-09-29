import React from "react";
import "./CalendarComponent.css";

const CalendarComponent = () => {
  const currentDate = new Date();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = daysOfWeek[currentDate.getDay()]; // Get the current day name
  const date = currentDate.toLocaleDateString(); // Get the current date in locale format

  const generateCalendarGrid = () => {
    let grid = [];
    for (let i = 0; i < 7; i++) {
      const futureDate = new Date();
      futureDate.setDate(currentDate.getDate() + i); // Increment date by i days
      const dayOfWeek = daysOfWeek[futureDate.getDay()]; // Get the day name for the future date
      const dateString = futureDate.toLocaleDateString(); // Format the future date
      grid.push({ dayOfWeek, dateString }); // Add day and date to the grid array
    }
    return grid;
  };

  const calendarGrid = generateCalendarGrid();

  return (
    <div className="calendar-container">
      <h2>
        Today's Date: {day}, {date}
      </h2>

      <div className="button-group">
        <button>Indoor</button>
        <button>Outdoor</button>
      </div>
      <div className="calendar-grid">
        {calendarGrid.map((col, index) => (
          <div key={index} className="calendar-cell">
            <div>
              {col.dayOfWeek}, {col.dateString}
            </div>
            <div className="empty-row"></div>
            <div className="empty-row"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarComponent;
