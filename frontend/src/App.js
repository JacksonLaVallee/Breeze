// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// src/App.js
import React from 'react';
import VisGoogleMapComponent from './components/VisGoogleMapComponent'; // Import the new Google Map component
import './App.css'; // Optional: Include your CSS styles

function App() {
  return (
    <div className="App">
      <h1>Breeze App - Vis GL Google Maps Integration</h1>
      {/* Render the Vis GL Google Map Component */}
      <VisGoogleMapComponent />
    </div>
  );
}

export default App;

