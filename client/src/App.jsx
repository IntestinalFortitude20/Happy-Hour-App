

import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/happy-hours')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch events');
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <h1>Happy Hour Events</h1>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event._id}>
              <strong>{event.name}</strong> - {event.eventType} <br />
              {event.address} <br />
              {event.daysOfWeek && event.daysOfWeek.join(', ')} <br />
              {event.startTime} - {event.endTime} <br />
              Specials: {event.specials}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App
