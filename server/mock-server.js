const express = require('express');
const cors = require('cors');
const mockEvents = require('./mockData');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

console.log('Starting server with mock data...');

// Mock endpoint - GET route to fetch all happy hour events
app.get('/api/happy-hours', async (req, res) => {
  try {
    let filteredEvents = [...mockEvents];
    
    // Apply filters based on query parameters
    if (req.query.eventType) {
      filteredEvents = filteredEvents.filter(event => 
        event.eventType === req.query.eventType
      );
    }
    
    if (req.query.name) {
      filteredEvents = filteredEvents.filter(event => 
        event.name.toLowerCase().includes(req.query.name.toLowerCase())
      );
    }
    
    if (req.query.address) {
      filteredEvents = filteredEvents.filter(event => 
        event.address.toLowerCase().includes(req.query.address.toLowerCase())
      );
    }
    
    if (req.query.dayOfWeek) {
      filteredEvents = filteredEvents.filter(event => 
        event.daysOfWeek.includes(req.query.dayOfWeek)
      );
    }
    
    if (req.query.specials) {
      filteredEvents = filteredEvents.filter(event => 
        event.specials && event.specials.toLowerCase().includes(req.query.specials.toLowerCase())
      );
    }
    
    res.status(200).json(filteredEvents);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to fetch happy hour events.' });
  }
});

// Mock endpoint - GET route to fetch events by proximity
app.get('/api/happy-hours/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required for proximity search.' });
    }
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusMiles = parseFloat(radius);
    
    if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusMiles)) {
      return res.status(400).json({ error: 'Invalid latitude, longitude, or radius values.' });
    }
    
    // Simple distance calculation for demonstration
    const nearbyEvents = mockEvents.filter(event => {
      if (!event.location || !event.location.latitude || !event.location.longitude) {
        return false;
      }
      
      const distance = calculateDistance(
        latitude, longitude,
        event.location.latitude, event.location.longitude
      );
      
      return distance <= radiusMiles;
    });
    
    res.status(200).json(nearbyEvents);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to fetch nearby events.' });
  }
});

// Simple distance calculation using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

app.listen(port, () => {
  console.log(`Mock server is running on http://localhost:${port}`);
});