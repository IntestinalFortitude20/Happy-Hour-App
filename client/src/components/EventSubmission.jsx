import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './EventSubmission.css';

function EventSubmission({ isOpen, onClose, onEventCreated }) {
  const { token, user } = useAuth();
  const [formData, setFormData] = useState({
    eventType: 'Happy Hour',
    name: '',
    address: '',
    startTime: '',
    endTime: '',
    daysOfWeek: [],
    specials: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const eventTypes = ['Happy Hour', 'Bingo', 'Trivia', 'Live Music', 'Jam Session', 'Other'];
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayChange = (day) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.daysOfWeek.length === 0) {
      setError('Please select at least one day of the week');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/happy-hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newEvent = await response.json();
        onEventCreated(newEvent);
        onClose();
        // Reset form
        setFormData({
          eventType: 'Happy Hour',
          name: '',
          address: '',
          startTime: '',
          endTime: '',
          daysOfWeek: [],
          specials: ''
        });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create event');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="event-submission-modal">
      <div className="event-submission-content">
        <div className="submission-header">
          <h2>Submit New Event</h2>
          <button className="submission-close" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="eventType">Event Type:</label>
            <select 
              id="eventType"
              name="eventType" 
              value={formData.eventType} 
              onChange={handleInputChange}
              required
            >
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">Venue Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time:</label>
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
              <label htmlFor="endTime">End Time:</label>
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
            <label>Days of Week:</label>
            <div className="days-selection">
              {daysOfWeek.map(day => (
                <label key={day} className="day-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.daysOfWeek.includes(day)}
                    onChange={() => handleDayChange(day)}
                  />
                  {day.slice(0, 3)}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="specials">Specials (optional):</label>
            <textarea
              id="specials"
              name="specials"
              value={formData.specials}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe any special offers..."
            />
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Creating Event...' : 'Submit Event'}
          </button>
        </form>

        <div className="submitter-info">
          <small>Submitted by: {user?.name}</small>
        </div>
      </div>
    </div>
  );
}

export default EventSubmission;