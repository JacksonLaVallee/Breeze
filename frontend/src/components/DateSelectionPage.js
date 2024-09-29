// src/components/DateSelectionPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserPreferencesModal from './UserPreferencesModal'; // Import the modal component
import './DateSelectionPage.css'; // Optional: Include CSS specific to this component

function DateSelectionPage() {
  const [showModal, setShowModal] = useState(true); // Show modal on initial load
  const [userPreferences, setUserPreferences] = useState({});
  const navigate = useNavigate();

  // Handle form submission from the modal
  const handlePreferencesSubmit = (preferences) => {
    setUserPreferences(preferences);
    setShowModal(false); // Close modal after submission

    // Navigate to the map page with preferences as state (or use context)
    navigate('/map', { state: { preferences } });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Select a Date and Preferences</h1>
      <div class="row">
        <div class="day col-1"></div>
        <div class="day col-1"></div>
        <div class="day col-1"></div>
        <div class="day col-1"></div>
        <div class="day col-1"></div>
        <div class="day col-1"></div>
        <div class="day col-1"></div>


      </div>
      <UserPreferencesModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSubmit={handlePreferencesSubmit}
      />
    </div>
  );
}

export default DateSelectionPage;
