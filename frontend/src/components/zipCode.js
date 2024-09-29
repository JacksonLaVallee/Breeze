import React, { useState } from "react";

function ZipCodePrompt({ onSubmitZipCode }) {
  const [zipCode, setZipCode] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (zipCode.match(/^\d{5}(-\d{4})?$/)) {
      onSubmitZipCode(zipCode);
    } else {
      alert("Please enter a valid zip code.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter your zip code:
        <input
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          pattern="\d{5}(-\d{4})?"
          title="Enter a 5-digit zip code or a 9-digit zip code with a dash"
          required
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default ZipCodePrompt;
