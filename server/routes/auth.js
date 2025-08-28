const express = require('express');
const User = require('../models/User');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({ email, password, name });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // User is already attached to req by authenticateToken middleware
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Add event to favorites
router.post('/favorites/:eventId', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const user = req.user;

    // Check if already in favorites
    if (user.favorites.includes(eventId)) {
      return res.status(400).json({ error: 'Event already in favorites' });
    }

    // Add to favorites
    user.favorites.push(eventId);
    await user.save();

    res.json({ message: 'Event added to favorites' });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add event to favorites' });
  }
});

// Remove event from favorites
router.delete('/favorites/:eventId', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const user = req.user;

    // Remove from favorites
    user.favorites = user.favorites.filter(id => id.toString() !== eventId);
    await user.save();

    res.json({ message: 'Event removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Failed to remove event from favorites' });
  }
});

// Get user's favorite events
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

module.exports = router;