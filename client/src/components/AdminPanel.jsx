import { useState, useEffect } from 'react';
import './AdminPanel.css';

function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/happy-hours/admin');
      if (!response.ok) throw new Error('Failed to fetch events');
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (eventId, action) => {
    setActionLoading(prev => ({ ...prev, [eventId]: action }));
    
    try {
      const response = await fetch(`http://localhost:3000/api/happy-hours/${eventId}/${action}`, {
        method: 'PUT',
      });
      
      if (!response.ok) throw new Error(`Failed to ${action} event`);
      
      // Refresh the events list
      await fetchEvents();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [eventId]: null }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="admin-panel loading">Loading events...</div>;
  if (error) return <div className="admin-panel error">Error: {error}</div>;

  const pendingEvents = events.filter(event => event.status === 'pending');
  const reviewedEvents = events.filter(event => event.status !== 'pending');

  return (
    <div className="admin-panel">
      <h2>Event Moderation Panel</h2>
      
      <div className="admin-stats">
        <div className="stat">
          <span className="stat-number">{pendingEvents.length}</span>
          <span className="stat-label">Pending Review</span>
        </div>
        <div className="stat">
          <span className="stat-number">{events.filter(e => e.status === 'approved').length}</span>
          <span className="stat-label">Approved</span>
        </div>
        <div className="stat">
          <span className="stat-number">{events.filter(e => e.status === 'rejected').length}</span>
          <span className="stat-label">Rejected</span>
        </div>
      </div>

      {pendingEvents.length > 0 && (
        <div className="events-section">
          <h3>Pending Events ({pendingEvents.length})</h3>
          <div className="events-grid">
            {pendingEvents.map((event) => (
              <div key={event._id} className="admin-event-card pending">
                <div className="event-header">
                  <h4>{event.name}</h4>
                  <span className={`status-badge ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                
                <div className="event-details">
                  <div><strong>Type:</strong> {event.eventType}</div>
                  <div><strong>Address:</strong> {event.address}</div>
                  <div><strong>Days:</strong> {event.daysOfWeek.join(', ')}</div>
                  <div><strong>Time:</strong> {event.startTime} - {event.endTime}</div>
                  {event.specials && <div><strong>Specials:</strong> {event.specials}</div>}
                  <div className="submission-date">
                    <strong>Submitted:</strong> {formatDate(event.createdAt)}
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={() => handleAction(event._id, 'approve')}
                    disabled={actionLoading[event._id]}
                    className="approve-btn"
                  >
                    {actionLoading[event._id] === 'approve' ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleAction(event._id, 'reject')}
                    disabled={actionLoading[event._id]}
                    className="reject-btn"
                  >
                    {actionLoading[event._id] === 'reject' ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reviewedEvents.length > 0 && (
        <div className="events-section">
          <h3>Previously Reviewed Events ({reviewedEvents.length})</h3>
          <div className="events-grid">
            {reviewedEvents.map((event) => (
              <div key={event._id} className={`admin-event-card ${event.status}`}>
                <div className="event-header">
                  <h4>{event.name}</h4>
                  <span className={`status-badge ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                
                <div className="event-details">
                  <div><strong>Type:</strong> {event.eventType}</div>
                  <div><strong>Address:</strong> {event.address}</div>
                  <div><strong>Days:</strong> {event.daysOfWeek.join(', ')}</div>
                  <div><strong>Time:</strong> {event.startTime} - {event.endTime}</div>
                  {event.specials && <div><strong>Specials:</strong> {event.specials}</div>}
                  <div className="submission-date">
                    <strong>Submitted:</strong> {formatDate(event.createdAt)}
                  </div>
                  <div className="review-date">
                    <strong>Last Updated:</strong> {formatDate(event.updatedAt)}
                  </div>
                </div>

                {event.status === 'rejected' && (
                  <div className="action-buttons">
                    <button
                      onClick={() => handleAction(event._id, 'approve')}
                      disabled={actionLoading[event._id]}
                      className="approve-btn"
                    >
                      {actionLoading[event._id] === 'approve' ? 'Approving...' : 'Approve'}
                    </button>
                  </div>
                )}

                {event.status === 'approved' && (
                  <div className="action-buttons">
                    <button
                      onClick={() => handleAction(event._id, 'reject')}
                      disabled={actionLoading[event._id]}
                      className="reject-btn"
                    >
                      {actionLoading[event._id] === 'reject' ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <div className="no-events">
          <p>No events to review.</p>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;