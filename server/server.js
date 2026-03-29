const express = require('express');
require('dotenv').config();

const app = express();
const cors = require('cors');
app.use(cors());
const HappyHour = require('./models/HappyHour');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');

// Middleware to parse JSON requests
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB!');
        
        // Start the server only after a successful database connection
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
  })
  .catch((err) => {
    console.error(err.message, 'Error connecting to MongoDB:');
  })

// POST route to create a new happy hour event
app.post('/api/happy-hours', async (req, res) => {
  try {
    // Create a new instance of the HappyHour model with data from the request body
    const newHappyHour = new HappyHour(req.body);

    // Save the new happy hour event to the database
    const savedHappyHour = await newHappyHour.save();

    // Send back a success response with the saved data
    res.status(201).json(savedHappyHour);
  } catch (err) {
    // Handle validation errors or other issues
    console.error(err);
    res.status(400).json({ error: 'Failed to create happy hour event.' });
  }
});

// GET route to fetch all happy hour events with optional limit and search
app.get('/api/happy-hours', async (req, res) => {
  try {
    // Get the limit from query parameters or default to 30
    const limit = parseInt(req.query.limit) || 30;
    
    // Build search query based on query parameters
    const searchQuery = {};
    
    if (req.query.eventType) {
      searchQuery.eventType = req.query.eventType;
    }
    
    if (req.query.name) {
      searchQuery.name = { $regex: req.query.name, $options: 'i' };
    }
    
    if (req.query.address) {
      searchQuery.address = { $regex: req.query.address, $options: 'i' };
    }
    
    if (req.query.dayOfWeek) {
      searchQuery.daysOfWeek = { $in: [req.query.dayOfWeek] };
    }
    
    if (req.query.specials) {
      searchQuery.specials = { $regex: req.query.specials, $options: 'i' };
    }

    // Fetch happy hour events from the database with the specified limit and search criteria
    const happyHours = await HappyHour.find(searchQuery).limit(limit);

    // Send back the retrieved happy hour events
    res.status(200).json(happyHours);
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(400).json({ error: 'Failed to fetch happy hour events.' });
  }
});

// GET route to fetch events by proximity (within a certain radius of lat/lng)
app.get('/api/happy-hours/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query; // radius in miles, default 50
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required for proximity search.' });
    }
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusMiles = parseFloat(radius);
    
    if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusMiles)) {
      return res.status(400).json({ error: 'Invalid latitude, longitude, or radius values.' });
    }
    
    // Find events within the specified radius using MongoDB's geospatial query
    // Convert miles to radians (divide by earth's radius in miles: 3959)
    const radiusInRadians = radiusMiles / 3959;
    
    const nearbyEvents = await HappyHour.find({
      'location.latitude': { $exists: true },
      'location.longitude': { $exists: true },
      'location.latitude': {
        $gte: latitude - radiusInRadians * 180 / Math.PI,
        $lte: latitude + radiusInRadians * 180 / Math.PI
      },
      'location.longitude': {
        $gte: longitude - radiusInRadians * 180 / Math.PI / Math.cos(latitude * Math.PI / 180),
        $lte: longitude + radiusInRadians * 180 / Math.PI / Math.cos(latitude * Math.PI / 180)
      }
    });
    
    res.status(200).json(nearbyEvents);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to fetch nearby events.' });
  }
});

// GET route to fetch a single happy hour event by its unique ID
app.get('/api/happy-hours/:id', async (req, res) => {
  try {
    const happyHourId = req.params.id;

    // Find the happy hour event by its ID
    const happyHour = await HappyHour.findById(happyHourId);

    if (!happyHour) {
      // If no event is found, send a 404 response
      return res.status(404).json({ error: 'Happy hour event not found.' });
    }

    // Send back the found happy hour event
    res.status(200).json(happyHour);
  } catch (err) {
    // Handle errors (e.g., invalid ID format)
    console.error(err);
    res.status(400).json({ error: 'Failed to fetch happy hour event.' });
  }
});
// // Basic route
// app.get('/', (req, res) => {
//     res.send('Welcome to the Express.js server!');
// });

// Start the server
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });