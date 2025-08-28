import './EventList.css';
import { useAuth } from '../context/AuthContext';

function EventList({ events, loading, error }) {
  const { user, addToFavorites, removeFromFavorites, isAuthenticated } = useAuth();

  const handleFavoriteToggle = async (eventId) => {
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return;
    }

    const isFavorite = user?.favorites?.includes(eventId);
    
    if (isFavorite) {
      await removeFromFavorites(eventId);
    } else {
      await addToFavorites(eventId);
    }
  };
  if (loading) return <div className="status-message">Loading events...</div>;
  if (error) return <div className="status-message error">Error: {error}</div>;

  return (
    <div className="event-list">
      {events.length === 0 ? (
        <div className="status-message">No events found. Try adjusting your search criteria.</div>
      ) : (
        <div className="events-grid">
          {events.map((event) => {
            const isFavorite = user?.favorites?.includes(event._id);
            return (
              <div key={event._id} className="event-card">
                <div className="event-header">
                  <h3 className="event-name">{event.name}</h3>
                  <button 
                    className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
                    onClick={() => handleFavoriteToggle(event._id)}
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {isFavorite ? '❤️' : '🤍'}
                  </button>
                </div>
                <div className="event-details">
                  <div className="event-type">{event.eventType}</div>
                  <div className="event-address">{event.address}</div>
                  <div className="event-schedule">
                    <strong>Days:</strong> {event.daysOfWeek && event.daysOfWeek.join(', ')}
                  </div>
                  <div className="event-time">
                    <strong>Time:</strong> {event.startTime} - {event.endTime}
                  </div>
                  {event.specials && (
                    <div className="event-specials">
                      <strong>Specials:</strong> {event.specials}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default EventList;