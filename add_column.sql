-- Add invited_user_id column to events table
ALTER TABLE events ADD COLUMN invited_user_id UUID REFERENCES users(id) ON DELETE CASCADE;