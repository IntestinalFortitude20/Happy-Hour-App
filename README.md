# Happy-Hour-App

This app serves as a database for local happy hours, trivia nights, bingo nights, etc. in bars, breweries, and restaurants.

## Features

### Event Discovery
- Search for events by name, address, event type, day of the week, or specials
- Browse various event types: Happy Hour, Bingo, Trivia, Live Music, Jam Session, and more
- View detailed event information including times, days, and special offers

### User Authentication
- **User Registration & Login**: Create accounts with secure password hashing
- **Favorites System**: Save and manage your favorite events with heart icons
- **Event Submission**: Authenticated users can submit new events to the database
- **User Profiles**: View your account information and manage favorites
- **JWT Authentication**: Secure token-based authentication system

### Technology Stack
- **Frontend**: React with Vite, Context API for state management
- **Backend**: Express.js with Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcryptjs password hashing
- **Styling**: Custom CSS with responsive design

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/IntestinalFortitude20/Happy-Hour-App.git
cd Happy-Hour-App
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Set up environment variables in `server/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_for_jwt
JWT_EXPIRES_IN=7d
```

### Running the Application

1. Start the server (from the server directory):
```bash
npm run dev
```

2. Start the client (from the client directory):
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Authentication System

The app includes a complete authentication system with the following features:

- **Secure Registration**: Email validation and password hashing
- **Login/Logout**: JWT token-based authentication
- **Protected Routes**: Event creation requires authentication
- **Favorites Management**: Save and organize your favorite events
- **User Profiles**: View account information and favorites

For detailed authentication documentation, see [AUTHENTICATION.md](./AUTHENTICATION.md).

## API Endpoints

### Public Endpoints
- `GET /api/happy-hours` - Get all events (with search/filter options)
- `GET /api/happy-hours/:id` - Get specific event by ID

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/auth/favorites` - Get user favorites (protected)
- `POST /api/auth/favorites/:eventId` - Add to favorites (protected)
- `DELETE /api/auth/favorites/:eventId` - Remove from favorites (protected)

### Protected Endpoints
- `POST /api/happy-hours` - Create new event (requires authentication)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the ISC License.
