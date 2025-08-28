import './Header.css';
import { useAuth } from '../context/AuthContext';

function Header({ onLoginClick, onProfileClick, onSubmitEventClick }) {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>Happy Hour Finder</h1>
          <p>Find your perfect happy hour, trivia night, or event</p>
        </div>
        <div className="header-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="welcome-text">Hello, {user?.name}!</span>
              <button className="header-button" onClick={onSubmitEventClick}>
                Submit Event
              </button>
              <button className="header-button" onClick={onProfileClick}>
                Profile
              </button>
              <button className="header-button logout" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="header-button" onClick={onLoginClick}>
                Login / Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;