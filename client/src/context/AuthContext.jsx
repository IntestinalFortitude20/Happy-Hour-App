import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await fetch('http://localhost:3000/api/auth/profile', {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setToken(storedToken);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const addToFavorites = async (eventId) => {
    if (!token) return { success: false, error: 'Not authenticated' };

    try {
      const response = await fetch(`http://localhost:3000/api/auth/favorites/${eventId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Update user's favorites
        setUser(prev => ({
          ...prev,
          favorites: [...prev.favorites, eventId]
        }));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const removeFromFavorites = async (eventId) => {
    if (!token) return { success: false, error: 'Not authenticated' };

    try {
      const response = await fetch(`http://localhost:3000/api/auth/favorites/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Update user's favorites
        setUser(prev => ({
          ...prev,
          favorites: prev.favorites.filter(id => id !== eventId)
        }));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    addToFavorites,
    removeFromFavorites,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};