import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './Auth.css';

function AuthModal({ isOpen, onClose }) {
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (!isOpen) return null;

  const handleToggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  const handleSuccess = () => {
    onClose();
  };

  return (
    <div className="auth-modal">
      <div className="auth-modal-content">
        <button className="auth-modal-close" onClick={onClose}>
          ×
        </button>
        {isLoginMode ? (
          <Login onToggleMode={handleToggleMode} onSuccess={handleSuccess} />
        ) : (
          <Register onToggleMode={handleToggleMode} onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}

export default AuthModal;