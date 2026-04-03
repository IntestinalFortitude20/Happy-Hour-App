const express = require('express');
require('dotenv').config();

const app = express();
const cors = require('cors');
app.use(cors());

const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// In-memory storage for demonstration
let events = [
  {
    _id: '1',
    eventType: 'Happy Hour',
    name: 'Sample Brewery',
    address: '123 Main St, City, State',
    startTime: '16:00',
    endTime: '18:00',
    daysOfWeek: ['Monday', 'Tuesday', 'Wednesday'],
    specials: '$5 beers, half-price appetizers',
    status: 'approved',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    _id: '2',
    eventType: 'Trivia',
    name: 'Quiz Night Pub',
    address: '456 Oak Ave, City, State',
    startTime: '19:00',
    endTime: '21:00',
    daysOfWeek: ['Thursday'],
    specials: 'Team prizes, drink specials',
    status: 'pending',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];

let nextId = 3;

console.log('Using in-memory storage for demonstration');

// POST route to create a new happy hour event
app.post('/api/happy-hours', async (req, res) => {
  try {
    const newEvent = {
      _id: String(nextId++),
      ...req.body,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    events.push(newEvent);
    console.log('New event submitted:', newEvent.name);
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create happy hour event.' });
  }
});

// GET route to fetch all approved happy hour events
app.get('/api/happy-hours', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    
    let searchQuery = events.filter(event => event.status === 'approved');
    
    if (req.query.eventType) {
      searchQuery = searchQuery.filter(event => event.eventType === req.query.eventType);
    }
    
    if (req.query.name) {
      searchQuery = searchQuery.filter(event => 
        event.name.toLowerCase().includes(req.query.name.toLowerCase())
      );
    }
    
    if (req.query.address) {
      searchQuery = searchQuery.filter(event => 
        event.address.toLowerCase().includes(req.query.address.toLowerCase())
      );
    }
    
    if (req.query.dayOfWeek) {
      searchQuery = searchQuery.filter(event => 
        event.daysOfWeek.includes(req.query.dayOfWeek)
      );
    }
    
    if (req.query.specials) {
      searchQuery = searchQuery.filter(event => 
        event.specials && event.specials.toLowerCase().includes(req.query.specials.toLowerCase())
      );
    }

    const result = searchQuery.slice(0, limit);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to fetch happy hour events.' });
  }
});

// GET route to fetch pending events for moderation
app.get('/api/happy-hours/pending', async (req, res) => {
  try {
    const pendingEvents = events.filter(event => event.status === 'pending');
    res.status(200).json(pendingEvents);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to fetch pending events.' });
  }
});

// GET route to fetch all events for admin panel
app.get('/api/happy-hours/admin', async (req, res) => {
  try {
    const allEvents = [...events].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(allEvents);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to fetch events for admin.' });
  }
});

// PUT route to approve an event
app.put('/api/happy-hours/:id/approve', async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = events.find(e => e._id === eventId);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    
    event.status = 'approved';
    event.updatedAt = new Date();
    console.log('Event approved:', event.name);
    
    res.status(200).json(event);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to approve event.' });
  }
});

// PUT route to reject an event
app.put('/api/happy-hours/:id/reject', async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = events.find(e => e._id === eventId);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    
    event.status = 'rejected';
    event.updatedAt = new Date();
    console.log('Event rejected:', event.name);
    
    res.status(200).json(event);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to reject event.' });
  }
});

// GET route to fetch a single happy hour event by its unique ID
app.get('/api/happy-hours/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = events.find(e => e._id === eventId);

    if (!event) {
      return res.status(404).json({ error: 'Happy hour event not found.' });
    }

    res.status(200).json(event);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to fetch happy hour event.' });
  }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Demo mode: ${events.length} events loaded in memory`);
});