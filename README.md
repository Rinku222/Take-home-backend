# RSVP Backend API

A Node.js REST API for managing events and RSVPs with PostgreSQL and Redis.

## Features

- User authentication with JWT
- Event creation and management
- RSVP functionality
- PostgreSQL database with UUID primary keys
- Redis for caching
- Input validation and security middleware

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Redis (v6 or higher)

## Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup PostgreSQL**
   ```bash
   # Create database
   createdb rsvp_db
   
   # Create the update function (required for triggers)
   psql rsvp_db -c "
   CREATE OR REPLACE FUNCTION update_updated_at()
   RETURNS TRIGGER AS \$\$
   BEGIN
       NEW.updated_at = CURRENT_TIMESTAMP;
       RETURN NEW;
   END;
   \$\$ LANGUAGE plpgsql;"
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rsvp_db
DB_USER=your_username
DB_PASSWORD=your_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile (authenticated)

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event (authenticated)
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event (authenticated)
- `DELETE /api/events/:id` - Delete event (authenticated)

### Health Check
- `GET /health` - Server health status

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations
- `npm run setup` - Install dependencies and run migrations

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts with authentication
- `events` - Event information with creator and invited user references

## Development

1. Start PostgreSQL and Redis services
2. Run `npm run dev` for development with auto-reload
3. API will be available at `http://localhost:3000`

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure proper database credentials
4. Run `npm start`

## License

ISC