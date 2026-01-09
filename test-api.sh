#!/bin/bash

# Simple API test script
# Make sure the server is running before executing this script

BASE_URL="http://localhost:3000"

echo "=== Testing RSVP API ==="
echo ""

# Health check
echo "1. Health Check:"
curl -s "$BASE_URL/health" | jq .
echo ""

# Create RSVP
echo "2. Creating RSVP:"
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/rsvps" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "event_name": "Tech Conference 2024",
    "attendance_status": "attending"
  }')
echo "$CREATE_RESPONSE" | jq .
RSVP_ID=$(echo "$CREATE_RESPONSE" | jq -r '.data.id')
echo ""

# Get all RSVPs
echo "3. Getting all RSVPs:"
curl -s "$BASE_URL/api/rsvps" | jq .
echo ""

# Get RSVP by ID
echo "4. Getting RSVP by ID ($RSVP_ID):"
curl -s "$BASE_URL/api/rsvps/$RSVP_ID" | jq .
echo ""

# Update RSVP
echo "5. Updating RSVP:"
curl -s -X PUT "$BASE_URL/api/rsvps/$RSVP_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "attendance_status": "not_attending"
  }' | jq .
echo ""

# Get token
echo "6. Getting authentication token:"
TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/token" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "email": "test@example.com"
  }')
echo "$TOKEN_RESPONSE" | jq .
TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.token')
echo ""

# Delete RSVP (requires auth)
echo "7. Deleting RSVP (requires authentication):"
curl -s -X DELETE "$BASE_URL/api/rsvps/$RSVP_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

echo "=== Tests Complete ==="

