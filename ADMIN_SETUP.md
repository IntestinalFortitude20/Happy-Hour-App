# Admin Setup Guide for Happy Hour App

## Overview

The Happy Hour App now includes an event submission and moderation system. Users can submit events through a form, and administrators can review, approve, or reject these submissions before they appear publicly.

## How the Moderation System Works

1. **Event Submission**: Users fill out a form with event details (venue name, address, event type, days, times, specials)
2. **Pending Status**: Submitted events have a "pending" status and are not visible in public searches
3. **Admin Review**: Administrators can view all pending events in the Admin Panel
4. **Approval/Rejection**: Admins can approve events (making them public) or reject them
5. **Public Display**: Only approved events appear in search results

## Setting Up Admin Access

### Database Setup

1. **MongoDB Connection**: Ensure your `.env` file in the `server` directory contains:
   ```
   MONGODB_URI=mongodb://localhost:27017/happyhour
   ```
   (Replace with your actual MongoDB connection string)

2. **Start the Application**:
   ```bash
   # Terminal 1 - Start the server
   cd server
   npm install
   npm run dev
   
   # Terminal 2 - Start the client
   cd client
   npm install
   npm run dev
   ```

### Accessing the Admin Panel

The application includes three main views accessible via the navigation menu:

1. **Search Events** - Public view for searching approved events
2. **Submit Event** - Form for users to submit new events
3. **Admin Panel** - Moderation interface for reviewing events

**Important**: The current implementation does not include authentication. In a production environment, you would want to add proper user authentication and authorization to restrict admin panel access.

### Admin Panel Features

- **Dashboard Statistics**: Shows counts of pending, approved, and rejected events
- **Pending Events Section**: Lists all events awaiting review with approve/reject buttons
- **Previously Reviewed**: Shows all approved and rejected events with ability to change status
- **Event Details**: Displays all submitted information including submission timestamps

### Managing Events

#### Approving Events
1. Navigate to the Admin Panel
2. Find the event in the "Pending Events" section
3. Review the event details carefully
4. Click "Approve" to make the event public

#### Rejecting Events
1. Navigate to the Admin Panel
2. Find the event in the "Pending Events" section
3. Click "Reject" to prevent the event from appearing publicly

#### Changing Status
- Rejected events can be approved later
- Approved events can be rejected if needed
- Status changes are reflected immediately

### Database Management

To directly manage events in the database, you can use MongoDB commands:

#### View all events with their status:
```javascript
db.happyhours.find({}, {name: 1, status: 1, eventType: 1, createdAt: 1})
```

#### Approve an event by ID:
```javascript
db.happyhours.updateOne(
  {_id: ObjectId("EVENT_ID_HERE")}, 
  {$set: {status: "approved"}}
)
```

#### Reject an event by ID:
```javascript
db.happyhours.updateOne(
  {_id: ObjectId("EVENT_ID_HERE")}, 
  {$set: {status: "rejected"}}
)
```

#### Set all existing events to approved (for migration):
```javascript
db.happyhours.updateMany(
  {status: {$exists: false}}, 
  {$set: {status: "approved"}}
)
```

### API Endpoints

The application provides these admin-related API endpoints:

- `GET /api/happy-hours` - Returns only approved events (public)
- `GET /api/happy-hours/pending` - Returns pending events
- `GET /api/happy-hours/admin` - Returns all events with status
- `PUT /api/happy-hours/:id/approve` - Approve an event
- `PUT /api/happy-hours/:id/reject` - Reject an event
- `POST /api/happy-hours` - Submit new event (status: pending)

### Security Considerations for Production

1. **Authentication**: Implement user authentication system
2. **Authorization**: Add role-based access control for admin functions
3. **Input Validation**: Add server-side validation for all form inputs
4. **Rate Limiting**: Implement rate limiting for form submissions
5. **HTTPS**: Use HTTPS in production
6. **Environment Variables**: Store sensitive data in environment variables
7. **Database Security**: Secure MongoDB connection and access

### Troubleshooting

#### Events not appearing in search
- Check if events have "approved" status in the database
- Verify the GET /api/happy-hours endpoint is working

#### Unable to submit events
- Check if the server is running and accepting connections
- Verify the POST /api/happy-hours endpoint is accessible
- Check browser console for JavaScript errors

#### Admin panel not loading events
- Verify the GET /api/happy-hours/admin endpoint is working
- Check server logs for database connection issues
- Ensure MongoDB is running and accessible

### Migration from Existing Data

If you have existing events in your database without a status field, run this command to approve them all:

```bash
# Using MongoDB shell
mongo your-database-name
db.happyhours.updateMany({status: {$exists: false}}, {$set: {status: "approved"}})
```

This ensures existing events remain visible while new submissions go through the moderation process.