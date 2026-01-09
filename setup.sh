#!/bin/bash

echo "=== Setting up RSVP Backend ==="
echo ""

# Check if PostgreSQL is running
echo "Checking PostgreSQL connection..."
psql -U postgres -c "SELECT 1" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Warning: Could not connect to PostgreSQL. Please ensure PostgreSQL is running and accessible."
    echo "You may need to:"
    echo "  - Start PostgreSQL service"
    echo "  - Update DB_USER and DB_PASSWORD in .env file"
    echo ""
else
    echo "✓ PostgreSQL connection successful"
fi

# Create database if it doesn't exist
echo ""
echo "Creating database if it doesn't exist..."
psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='rsvp_db'" | grep -q 1 || psql -U postgres -c "CREATE DATABASE rsvp_db"
if [ $? -eq 0 ]; then
    echo "✓ Database 'rsvp_db' is ready"
else
    echo "Warning: Could not create database. You may need to create it manually:"
    echo "  createdb rsvp_db"
fi

# Run migrations
echo ""
echo "Running database migrations..."
npm run migrate
if [ $? -eq 0 ]; then
    echo "✓ Database migrations completed"
else
    echo "✗ Database migrations failed"
    exit 1
fi

# Check if Redis is running
echo ""
echo "Checking Redis connection..."
redis-cli ping > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Redis is running"
else
    echo "Warning: Redis is not running. Please start Redis:"
    echo "  brew services start redis  (macOS)"
    echo "  sudo systemctl start redis  (Linux)"
    echo "  redis-server  (direct)"
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Make sure PostgreSQL and Redis are running"
echo "2. Install dependencies: npm install"
echo "3. Start the server: npm run dev"

