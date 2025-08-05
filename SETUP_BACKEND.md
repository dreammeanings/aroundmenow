# 🚀 Backend Setup Guide - Around Me Now

## Prerequisites

### 1. Install Required Software
```bash
# Install Node.js (v18 or higher)
brew install node

# Install PostgreSQL
brew install postgresql

# Install Redis (for caching)
brew install redis

# Install Docker (optional, for containerized development)
brew install docker
```

### 2. Start Services
```bash
# Start PostgreSQL
brew services start postgresql

# Start Redis
brew services start redis
```

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env
```

**Required Environment Variables:**
- `JWT_SECRET`: Generate a secure random string
- `DB_PASSWORD`: Your PostgreSQL password
- `STRIPE_SECRET_KEY`: Your Stripe test secret key
- `AWS_ACCESS_KEY_ID`: Your AWS access key (for image uploads)
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key

### 4. Database Setup
```bash
# Create database
createdb around_me_now_dev

# Run migrations
npm run migrate

# Seed database with test data
npm run seed
```

### 5. Start Development Server
```bash
# Start the server
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google social login
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events with filtering
- `GET /api/events/:id` - Get single event
- `POST /api/events/:id/save` - Save/unsave event
- `GET /api/events/trending/events` - Get trending events
- `GET /api/events/friends/activity` - Get friends' activity

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/saved-events` - Get saved events
- `PUT /api/users/preferences` - Update preferences

### Venues
- `GET /api/venues` - Get user's venues
- `POST /api/venues` - Create venue
- `PUT /api/venues/:id` - Update venue
- `GET /api/venues/:id/events` - Get venue events

### Analytics
- `GET /api/analytics/user` - Get user analytics
- `GET /api/analytics/venue/:id` - Get venue analytics
- `POST /api/analytics/track` - Track custom event

### Payments
- `POST /api/payments/create-subscription` - Create subscription
- `GET /api/payments/subscriptions` - Get user subscriptions
- `POST /api/payments/webhook` - Stripe webhook

### Notifications
- `POST /api/notifications/send` - Send push notification
- `GET /api/notifications/settings` - Get notification settings
- `PUT /api/notifications/settings` - Update notification settings

## Testing the API

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 3. Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Get Events
```bash
curl http://localhost:3000/api/events
```

### 5. Get Events with Filters
```bash
curl "http://localhost:3000/api/events?search=music&dateRange=today&priceRange[]=Free&distance=25"
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password_hash` (String)
- `name` (String)
- `preferences` (JSONB)
- `notification_settings` (JSONB)
- `subscription_tier` (String)
- `created_at` (Timestamp)

### Venues Table
- `id` (UUID, Primary Key)
- `name` (String)
- `description` (Text)
- `address` (String)
- `latitude` (Decimal)
- `longitude` (Decimal)
- `subscription_tier` (String)
- `created_at` (Timestamp)

### Events Table
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text)
- `venue_id` (UUID, Foreign Key)
- `start_date` (Timestamp)
- `end_date` (Timestamp)
- `price` (Decimal)
- `price_range` (String)
- `tags` (JSONB)
- `event_types` (JSONB)
- `vibe` (JSONB)
- `latitude` (Decimal)
- `longitude` (Decimal)
- `trending_score` (Integer)
- `total_views` (Integer)
- `total_saves` (Integer)
- `created_at` (Timestamp)

## Development Workflow

### 1. Create New Migration
```bash
npx knex migrate:make create_new_table
```

### 2. Run Migrations
```bash
npm run migrate
```

### 3. Create Seed Data
```bash
npx knex seed:make seed_venues
```

### 4. Run Seeds
```bash
npm run seed
```

### 5. Reset Database
```bash
# Drop and recreate database
dropdb around_me_now_dev
createdb around_me_now_dev
npm run migrate
npm run seed
```

## Production Deployment

### 1. Environment Variables
Set all production environment variables:
- Database connection string
- JWT secret
- Stripe keys
- AWS credentials
- Redis URL

### 2. Database Migration
```bash
NODE_ENV=production npm run migrate
```

### 3. Start Production Server
```bash
NODE_ENV=production npm start
```

## Monitoring & Logging

### 1. Health Check Endpoint
```bash
curl http://localhost:3000/health
```

### 2. Logs
Check console logs for:
- Database connection status
- API request logs
- Error messages
- Analytics events

### 3. Database Monitoring
```bash
# Connect to database
psql around_me_now_dev

# Check table sizes
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats 
WHERE schemaname = 'public';

# Check slow queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL is running: `brew services list`
   - Verify database exists: `psql -l`
   - Check environment variables

2. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate token format

3. **CORS Errors**
   - Check FRONTEND_URL in .env
   - Verify CORS configuration
   - Test with Postman

4. **Rate Limiting**
   - Check rate limit settings
   - Monitor request frequency
   - Adjust limits if needed

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## Next Steps

1. **Complete API Routes**
   - Implement remaining endpoints
   - Add comprehensive error handling
   - Add input validation

2. **Add Authentication**
   - Integrate with React Native app
   - Test social login flows
   - Implement token refresh

3. **Add Payment Processing**
   - Set up Stripe webhooks
   - Test subscription flows
   - Add payment analytics

4. **Add Push Notifications**
   - Configure Expo push service
   - Test notification delivery
   - Add notification preferences

5. **Add Analytics**
   - Track user behavior
   - Monitor API performance
   - Set up dashboards

6. **Add Testing**
   - Unit tests for routes
   - Integration tests
   - API endpoint tests

---

**🎯 Goal: Have a fully functional backend API ready for the React Native app!** 