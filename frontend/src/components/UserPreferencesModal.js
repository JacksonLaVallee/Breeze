import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function UserPreferencesModal({ show, handleClose, onSubmit }) {
  const [date, setDate] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const [otherPreferences, setOtherPreferences] = useState("");

  const handleSubmit = () => {
    const preferences = {
      date,
      priceRange,
      groupSize,
      otherPreferences,
    };

    onSubmit(preferences);

    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Activity Preferences</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formDate">
            <Form.Label>Select Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPriceRange">
            <Form.Label>Price Range</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter price range (e.g., $20-$100)"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formGroupSize">
            <Form.Label>Group Size</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={groupSize}
              onChange={(e) => setGroupSize(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formOtherPreferences">
            <Form.Label>Other Preferences</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter any other preferences (e.g., indoor/outdoor)"
              value={otherPreferences}
              onChange={(e) => setOtherPreferences(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserPreferencesModal;
