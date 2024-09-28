import React from 'react';
import './CalendarComponent.css'; // Import external CSS for styling


// CalendarComponent functional component
const CalendarComponent = () => {
 // Get the current date and day of the week
 const currentDate = new Date();
 const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
 const day = daysOfWeek[currentDate.getDay()]; // Get the current day name
 const date = currentDate.toLocaleDateString(); // Get the current date in locale format


 // Function to generate a grid with the current day and the next 6 days
 const generateCalendarGrid = () => {
   let grid = [];
   // Loop through the next 7 days (including today)
   for (let i = 0; i < 7; i++) {
     const futureDate = new Date();
     futureDate.setDate(currentDate.getDate() + i); // Increment date by i days
     const dayOfWeek = daysOfWeek[futureDate.getDay()]; // Get the day name for the future date
     const dateString = futureDate.toLocaleDateString(); // Format the future date
     grid.push({ dayOfWeek, dateString }); // Add day and date to the grid array
   }
   return grid; // Return the complete array for the 7-day grid
 };


 const calendarGrid = generateCalendarGrid(); // Generate the calendar grid


 return (
   <div className="calendar-container">
     {/* Display the current day and date */}
     <h2>Today's Date: {day}, {date}</h2>
    
     {/* Buttons for "Indoor" and "Outdoor" options */}
     <div className="button-group">
       <button>Indoor</button>
       <button>Outdoor</button>
     </div>
     {/* Display the grid with 7 columns (days) and 3 rows */}
     <div className="calendar-grid">
       {calendarGrid.map((col, index) => (
         <div key={index} className="calendar-cell">
           {/* First row: Day and Date */}
           <div>{col.dayOfWeek}, {col.dateString}</div>
           {/* Second row: Empty */}
           <div className="empty-row"></div>
           {/* Third row: Empty */}
           <div className="empty-row"></div>
         </div>
       ))}
     </div>
   </div>
 );
};


export default CalendarComponent;