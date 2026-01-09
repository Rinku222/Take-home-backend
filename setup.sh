#!/bin/bash

echo "🚀 Setting up RSVP Backend..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your database credentials before continuing."
    echo "Press any key to continue after editing .env..."
    read -n 1 -s
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL and try again."
    exit 1
fi

# Source environment variables
source .env

# Create database if it doesn't exist
echo "🗄️  Setting up database..."
createdb $DB_NAME 2>/dev/null || echo "Database $DB_NAME already exists"

# Create the update function required for triggers
echo "🔧 Creating database functions..."
psql $DB_NAME -c "
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS \$\$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;" > /dev/null

# Run migrations
echo "🔄 Running database migrations..."
npm run migrate

echo "✅ Setup complete! You can now run:"
echo "   npm run dev    # Start development server"
echo "   npm start      # Start production server"