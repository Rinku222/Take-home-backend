# RSVP Backend API

A secure REST API backend for managing RSVPs (RSVP - Répondez s'il vous plaît) built with Node.js, PostgreSQL, and Redis.

## Features

- ✅ RESTful API endpoints for CRUD operations on RSVPs
- ✅ Input validation and sanitization to prevent SQL injection and malformed input
- ✅ Redis caching for RSVP list endpoint with automatic cache invalidation
- ✅ Token-based authentication for delete operations
- ✅ Security best practices (Helmet, CORS, input sanitization)
- ✅ PostgreSQL database with proper schema and constraints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Redis (v6 or higher)

## Quick Start

1. **Install dependencies and set up database**:
   ```bash
   npm run setup
   ```
   This will:
   - Install all npm packages
   - Automatically create the PostgreSQL database if it doesn't exist
   - Run database migrations to create tables

2. **Start PostgreSQL and Redis** (if not already running):
   ```bash
   # PostgreSQL (macOS with Homebrew)
   brew services start postgresql
   
   # Redis (macOS with Homebrew)
   brew services start redis
   
   # Or on Linux
   sudo systemctl start postgresql
   sudo systemctl start redis
   ```

3. **Start the application**:
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`.

**Note**: The application uses default configuration values. To customize, create a `.env` file in the root directory (see Configuration section below).

## Configuration

The application works with default values, but you can customize by creating a `.env` file:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rsvp_db
DB_USER=postgres
DB_PASSWORD=postgres

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

**Important**: 
- The database will be automatically created if it doesn't exist when you run `npm run migrate`
- Redis is optional - the app will work without it, but caching will be disabled
- Make sure PostgreSQL and Redis services are running before starting the server

## API Endpoints

### Health Check
- **GET** `/health` - Check if the server is running

### Authentication
- **POST** `/api/auth/token` - Generate a JWT token for testing
  ```json
  {
    "userId": "user123",
    "email": "user@example.com"
  }
  ```

### RSVP Endpoints

#### Get All RSVPs
- **GET** `/api/rsvps`
  - Returns a list of all RSVPs
  - Cached in Redis for 1 hour
  - Cache is automatically invalidated on create/update/delete

#### Get RSVP by ID
- **GET** `/api/rsvps/:id`
  - Returns a single RSVP by ID

#### Create RSVP
- **POST** `/api/rsvps`
  - Creates a new RSVP
  - Requires: `name`, `email`, `event_name`, `attendance_status`
  - Validates and sanitizes all inputs
  - Invalidates cache after creation

  **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "event_name": "Tech Conference 2024",
    "attendance_status": "attending"
  }
  ```

  **Valid attendance_status values:**
  - `attending`
  - `not_attending`
  - `maybe`

#### Update RSVP
- **PUT** `/api/rsvps/:id`
  - Updates an existing RSVP
  - All fields are optional
  - Validates and sanitizes all inputs
  - Invalidates cache after update

  **Request Body (all fields optional):**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "event_name": "Tech Conference 2024",
    "attendance_status": "not_attending"
  }
  ```

#### Delete RSVP
- **DELETE** `/api/rsvps/:id`
  - Deletes an RSVP
  - **Requires authentication** (JWT token in Authorization header)
  - Invalidates cache after deletion

  **Headers:**
  ```
  Authorization: Bearer <your-jwt-token>
  ```

## Authentication

To delete an RSVP, you need to include a JWT token in the Authorization header:

1. **Generate a token**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/token \
     -H "Content-Type: application/json" \
     -d '{"userId": "user123", "email": "user@example.com"}'
   ```

2. **Use the token**:
   ```bash
   curl -X DELETE http://localhost:3000/api/rsvps/1 \
     -H "Authorization: Bearer <your-token-here>"
   ```

## Security Features

1. **Input Validation**: All inputs are validated using `express-validator`
2. **Input Sanitization**: All inputs are sanitized to prevent XSS attacks
3. **SQL Injection Prevention**: Using parameterized queries with PostgreSQL
4. **Helmet**: Security headers to protect against common vulnerabilities
5. **CORS**: Cross-Origin Resource Sharing configuration
6. **JWT Authentication**: Secure token-based authentication for delete operations

## Caching Strategy

- **Cache Key**: `rsvp:list`
- **TTL**: 1 hour (3600 seconds)
- **Cache Invalidation**: Automatically invalidated on:
  - Creating a new RSVP
  - Updating an existing RSVP
  - Deleting an RSVP

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [] // For validation errors
}
```

## Example Usage

### Create an RSVP
```bash
curl -X POST http://localhost:3000/api/rsvps \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "event_name": "Tech Conference 2024",
    "attendance_status": "attending"
  }'
```

### Get All RSVPs
```bash
curl http://localhost:3000/api/rsvps
```

### Update an RSVP
```bash
curl -X PUT http://localhost:3000/api/rsvps/1 \
  -H "Content-Type: application/json" \
  -d '{
    "attendance_status": "not_attending"
  }'
```

### Delete an RSVP
```bash
# First, get a token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123"}' | jq -r '.token')

# Then delete
curl -X DELETE http://localhost:3000/api/rsvps/1 \
  -H "Authorization: Bearer $TOKEN"
```

## Project Structure

```
learn-redis/
├── src/
│   ├── controllers/
│   │   └── rsvpController.js    # RSVP business logic
│   ├── db/
│   │   ├── connection.js         # PostgreSQL connection
│   │   ├── redis.js              # Redis connection
│   │   ├── schema.sql            # Database schema
│   │   └── migrate.js            # Migration script
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   ├── cache.js              # Redis caching
│   │   └── validation.js         # Input validation
│   ├── routes/
│   │   ├── rsvpRoutes.js         # RSVP routes
│   │   └── authRoutes.js         # Auth routes
│   └── server.js                 # Express app setup
├── .env                          # Environment variables (create this)
├── .gitignore
├── package.json
└── README.md
```

## Testing

You can test the API using:
- **cURL** (examples provided above)
- **Postman**
- **Thunder Client** (VS Code extension)
- **HTTPie**

## Production Considerations

Before deploying to production:

1. Change `JWT_SECRET` to a strong, random secret
2. Set `NODE_ENV=production`
3. Use environment-specific database credentials
4. Set up proper Redis password authentication
5. Configure CORS to allow only your frontend domain
6. Set up proper logging and monitoring
7. Use a process manager like PM2
8. Set up SSL/TLS certificates
9. Implement rate limiting
10. Add comprehensive error logging

## License

ISC

