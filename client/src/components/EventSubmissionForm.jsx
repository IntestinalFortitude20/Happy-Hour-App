import { useState } from 'react';
import './EventSubmissionForm.css';

const eventTypes = ['Happy Hour', 'Bingo', 'Trivia', 'Live Music', 'Jam Session', 'Other'];
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function EventSubmissionForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    eventType: '',
    name: '',
    address: '',
    startTime: '',
    endTime: '',
    daysOfWeek: [],
    specials: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/happy-hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit event');
      }

      setSuccess(true);
      setFormData({
        eventType: '',
        name: '',
        address: '',
        startTime: '',
        endTime: '',
        daysOfWeek: [],
        specials: ''
      });

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="submission-success">
        <h2>Event Submitted Successfully!</h2>
        <p>Your event has been submitted for review. It will appear publicly once approved by a moderator.</p>
        <button onClick={() => setSuccess(false)} className="submit-another-btn">
          Submit Another Event
        </button>
      </div>
    );
  }

  return (
    <div className="event-submission-form">
      <h2>Submit a New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="eventType">Event Type *</label>
          <select
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Event Type</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="name">Venue Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Enter venue name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address *</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            placeholder="Enter venue address"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startTime">Start Time *</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time *</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Days of Week *</label>
          <div className="days-grid">
            {daysOfWeek.map(day => (
              <label key={day} className="day-checkbox">
                <input
                  type="checkbox"
                  checked={formData.daysOfWeek.includes(day)}
                  onChange={() => handleDayToggle(day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="specials">Specials</label>
          <textarea
            id="specials"
            name="specials"
            value={formData.specials}
            onChange={handleInputChange}
            placeholder="Describe any specials or deals (optional)"
            rows="3"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading || formData.daysOfWeek.length === 0}>
          {loading ? 'Submitting...' : 'Submit Event'}
        </button>
      </form>
    </div>
  );
}

export default EventSubmissionForm;