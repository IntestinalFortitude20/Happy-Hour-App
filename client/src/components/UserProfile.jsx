import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import EventList from './EventList';
import './UserProfile.css';

function UserProfile({ isOpen, onClose }) {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/auth/favorites', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      } else {
        setError('Failed to fetch favorites');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isOpen && token) {
      fetchFavorites();
    }
  }, [isOpen, token, fetchFavorites]);

  if (!isOpen) return null;

  return (
    <div className="profile-modal">
      <div className="profile-modal-content">
        <div className="profile-header">
          <h2>User Profile</h2>
          <button className="profile-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="profile-info">
          <h3>Welcome, {user?.name}!</h3>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
        </div>

        <div className="profile-favorites">
          <h3>Your Favorite Events ({favorites.length})</h3>
          {loading ? (
            <div className="loading-message">Loading favorites...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : favorites.length === 0 ? (
            <div className="no-favorites">
              <p>You haven't added any favorites yet.</p>
              <p>Start exploring events and click the heart icon to save them here!</p>
            </div>
          ) : (
            <EventList events={favorites} loading={false} error={null} />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;