# Authentication Documentation

## Overview

The Happy Hour App now includes a complete user authentication system using JWT (JSON Web Tokens). This system allows users to register accounts, log in, and access personalized features like saving favorite events.

## Authentication Process

### 1. User Registration
- Users create an account with their name, email, and password
- Passwords are hashed using bcryptjs before storing in the database
- Upon successful registration, a JWT token is generated and returned
- The token is stored in localStorage for persistence across browser sessions

### 2. User Login
- Users authenticate using email and password
- The server verifies credentials by comparing the hashed password
- If successful, a JWT token is generated and returned
- The token is stored in localStorage

### 3. Token-Based Authentication
- JWT tokens are signed with a secret key stored on the server
- Tokens have a default expiration time of 7 days
- For protected routes, the client sends the token in the Authorization header
- The server validates the token and extracts user information

### 4. Protected Features
- **Event Creation**: Only authenticated users can submit new events
- **Favorites**: Users can save and manage their favorite events
- **Profile Management**: Users can view their profile and favorites

## Frontend Implementation

### Authentication Context (`AuthContext.jsx`)
- Manages global authentication state using React Context
- Provides login, register, logout functions
- Handles token storage and validation
- Manages user favorites operations

### Components
1. **Login/Register Components**: Modal forms for authentication
2. **AuthModal**: Wrapper component for authentication flows
3. **UserProfile**: Displays user information and favorites
4. **Header**: Shows authentication status and user menu

### User Interface Features
- Heart icons on events for adding/removing favorites
- Login/logout buttons in the header
- User profile modal with favorites list
- Protected functionality with login prompts

## Backend Implementation

### Authentication Middleware (`auth.js`)
- `generateToken()`: Creates JWT tokens for users
- `authenticateToken()`: Middleware to verify JWT tokens
- `optionalAuth()`: Middleware for optional authentication

### User Model (`User.js`)
- Email/password authentication
- Password hashing with bcryptjs
- Favorites array storing event references
- Secure password handling (removed from JSON responses)

### Authentication Routes (`/api/auth`)
- `POST /register`: Create new user account
- `POST /login`: Authenticate user and return token
- `GET /profile`: Get current user profile (protected)
- `POST /favorites/:eventId`: Add event to favorites (protected)
- `DELETE /favorites/:eventId`: Remove event from favorites (protected)
- `GET /favorites`: Get user's favorite events (protected)

### Event Submission Protection
- Event creation now requires authentication
- Events track which user submitted them via `submittedBy` field

## Security Features

1. **Password Hashing**: All passwords are hashed using bcryptjs with salt rounds
2. **JWT Tokens**: Secure token-based authentication with expiration
3. **Token Validation**: All protected routes verify token authenticity
4. **Secure Headers**: Tokens sent via Authorization Bearer headers
5. **Input Validation**: Email format and password length validation

## API Usage Examples

### User Registration
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### User Login
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Adding to Favorites
```javascript
POST /api/auth/favorites/EVENT_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

### Creating Events (Protected)
```javascript
POST /api/happy-hours
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "eventType": "Happy Hour",
  "name": "Joe's Bar",
  "address": "123 Main St",
  "startTime": "5:00 PM",
  "endTime": "7:00 PM",
  "daysOfWeek": ["Monday", "Tuesday"],
  "specials": "Half price drinks"
}
```

## Environment Variables

The authentication system uses the following environment variables:

- `JWT_SECRET`: Secret key for signing JWT tokens (defaults to development key)
- `JWT_EXPIRES_IN`: Token expiration time (defaults to 7 days)
- `MONGODB_URI`: Database connection string

## Future Enhancements

Potential improvements to the authentication system:

1. **Password Reset**: Email-based password recovery
2. **Email Verification**: Verify user emails upon registration
3. **OAuth Integration**: Login with Google, Facebook, etc.
4. **Role-Based Access**: Admin users with additional privileges
5. **Session Management**: Track and manage user sessions
6. **Rate Limiting**: Prevent brute force attacks on login

## Usage for Developers

To use the authentication system in your development:

1. Set up environment variables in `server/.env`
2. Start the server: `npm run dev` in the server directory
3. Start the client: `npm run dev` in the client directory
4. Register a new account or login with existing credentials
5. Use authenticated features like favorites and event submission

The system is designed to be secure, user-friendly, and easily extensible for future enhancements.