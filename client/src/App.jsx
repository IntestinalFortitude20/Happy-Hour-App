

import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import EventList from './components/EventList';
import Map from './components/Map';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchLocation, setSearchLocation] = useState(null);

  const handleSearch = async (searchField, searchValue) => {
    if (!searchValue.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setSearchLocation(null); // Clear search location for text searches

    try {
      const queryParam = searchField === 'dayOfWeek' ? 'dayOfWeek' : searchField;
      const url = `http://localhost:3000/api/happy-hours?${queryParam}=${encodeURIComponent(searchValue)}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch events');
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = async (lat, lng) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setSearchLocation({ lat, lng }); // Set search location for map clicks

    try {
      const url = `http://localhost:3000/api/happy-hours/nearby?lat=${lat}&lng=${lng}&radius=25`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch nearby events');
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <SearchBar onSearch={handleSearch} />
      {hasSearched && (
        <>
          <EventList events={events} loading={loading} error={error} />
          {events.length > 0 && <Map events={events} onMapClick={handleMapClick} searchLocation={searchLocation} />}
        </>
      )}
      {!hasSearched && (
        <div className="welcome-message">
          <p>Welcome to Happy Hour Finder! Use the search above to find events by name, address, event type, day of the week, or specials.</p>
          <p><strong>New:</strong> After searching, you can click anywhere on the map to find events within 25 miles of that location!</p>
        </div>
      )}
    </div>
  );
}

export default App
