const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret - In production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'happyhour_jwt_secret_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Optional authentication middleware (doesn't require token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

module.exports = {
  generateToken,
  authenticateToken,
  optionalAuth
};