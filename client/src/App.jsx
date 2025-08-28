

import { useState } from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import EventList from './components/EventList';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import EventSubmission from './components/EventSubmission';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEventSubmission, setShowEventSubmission] = useState(false);

  const handleSearch = async (searchField, searchValue) => {
    if (!searchValue.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

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

  const handleEventCreated = (newEvent) => {
    // Add the new event to the current list if we have searched
    if (hasSearched) {
      setEvents(prev => [newEvent, ...prev]);
    }
    alert('Event submitted successfully!');
  };

  return (
    <AuthProvider>
      <div className="App">
        <Header 
          onLoginClick={() => setShowAuthModal(true)}
          onProfileClick={() => setShowProfile(true)}
          onSubmitEventClick={() => setShowEventSubmission(true)}
        />
        <SearchBar onSearch={handleSearch} />
        {hasSearched && (
          <EventList events={events} loading={loading} error={error} />
        )}
        {!hasSearched && (
          <div className="welcome-message">
            <p>Welcome to Happy Hour Finder! Use the search above to find events by name, address, event type, day of the week, or specials.</p>
            <p>Create an account to save your favorite events and submit new ones!</p>
          </div>
        )}
        
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
        
        <UserProfile 
          isOpen={showProfile} 
          onClose={() => setShowProfile(false)} 
        />

        <EventSubmission
          isOpen={showEventSubmission}
          onClose={() => setShowEventSubmission(false)}
          onEventCreated={handleEventCreated}
        />
      </div>
    </AuthProvider>
  );
}

export default App
