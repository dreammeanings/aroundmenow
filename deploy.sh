#!/bin/bash

# 🚀 Around Me Now Production Deployment Script
# Domain: aroundmenowapp.com

echo "🚀 Starting Around Me Now Production Deployment..."
echo "Domain: aroundmenowapp.com"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Error: Backend directory not found"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Step 1: Build the frontend
echo "📦 Building frontend for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo ""

# Step 2: Prepare backend for deployment
echo "🔧 Preparing backend for deployment..."
cd backend

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "⚠️  Warning: .env.production not found"
    echo "Please create .env.production with production environment variables"
    echo ""
    echo "Required variables:"
    echo "- NODE_ENV=production"
    echo "- PORT=3000"
    echo "- DATABASE_URL=your_production_db_url"
    echo "- JWT_SECRET=your_jwt_secret"
    echo "- CORS_ORIGIN=https://aroundmenowapp.com"
fi

# Run database migrations
echo "🗄️  Running database migrations..."
npm run migrate

if [ $? -eq 0 ]; then
    echo "✅ Database migrations successful"
else
    echo "❌ Database migrations failed"
    exit 1
fi

cd ..

echo ""

# Step 3: Create deployment files
echo "📝 Creating deployment configuration..."

# Create vercel.json for frontend
cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/\$1"
    },
    {
      "src": "/favicon.ico",
      "dest": "/favicon.ico"
    },
    {
      "src": "/manifest.json",
      "dest": "/manifest.json"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://api.aroundmenowapp.com",
    "REACT_APP_ENVIRONMENT": "production"
  }
}
EOF

echo "✅ Created vercel.json"

# Create railway.json for backend
cat > backend/railway.json << EOF
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF

echo "✅ Created railway.json"

echo ""

# Step 4: Create environment files
echo "🔐 Creating environment configuration..."

# Frontend environment
cat > .env.production << EOF
REACT_APP_API_URL=https://api.aroundmenowapp.com
REACT_APP_ENVIRONMENT=production
REACT_APP_ANALYTICS_ID=your_analytics_id
EOF

echo "✅ Created .env.production"

# Backend environment template
cat > backend/.env.production.template << EOF
NODE_ENV=production
PORT=3000
DATABASE_URL=your_production_database_url
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=https://aroundmenowapp.com
EOF

echo "✅ Created backend/.env.production.template"

echo ""

# Step 5: Create deployment instructions
echo "📋 Creating deployment instructions..."

cat > DEPLOYMENT_INSTRUCTIONS.md << EOF
# 🚀 Deployment Instructions for aroundmenowapp.com

## Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. **Login to Vercel:**
   \`\`\`bash
   vercel login
   \`\`\`

3. **Deploy to Vercel:**
   \`\`\`bash
   vercel --prod
   \`\`\`

4. **Add custom domain:**
   \`\`\`bash
   vercel domains add aroundmenowapp.com
   \`\`\`

## Backend Deployment (Railway)

1. **Create Railway account** at https://railway.app
2. **Connect GitHub repository**
3. **Set environment variables:**
   - NODE_ENV=production
   - DATABASE_URL=your_production_db_url
   - JWT_SECRET=your_jwt_secret
   - CORS_ORIGIN=https://aroundmenowapp.com

4. **Deploy backend**
5. **Get API URL** and update frontend environment

## Database Setup

1. **Create production database** (PostgreSQL)
2. **Run migrations:**
   \`\`\`bash
   cd backend
   npm run migrate
   \`\`\`

3. **Seed production data:**
   \`\`\`bash
   npm run seed
   \`\`\`

## DNS Configuration

### A Records:
- aroundmenowapp.com → Vercel IP
- api.aroundmenowapp.com → Railway IP

### CNAME Records:
- www.aroundmenowapp.com → aroundmenowapp.com

## SSL Certificate

- **Provider**: Let's Encrypt (automatic with Vercel/Railway)
- **Status**: HTTPS enforced

## Testing

1. **Test frontend**: https://aroundmenowapp.com
2. **Test API**: https://api.aroundmenowapp.com/health
3. **Test authentication**: Login/Register flow
4. **Test events**: Search, filter, save
5. **Test mobile**: Expo Go app

## Monitoring

- **Uptime**: Configure Pingdom
- **Errors**: Set up Sentry
- **Performance**: New Relic
- **Logs**: Papertrail

## Post-Launch

1. **Monitor performance**
2. **Gather user feedback**
3. **Fix any issues**
4. **Scale as needed**

🎉 Your app will be live at https://aroundmenowapp.com!
EOF

echo "✅ Created DEPLOYMENT_INSTRUCTIONS.md"

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure DNS for aroundmenowapp.com"
echo "2. Deploy frontend to Vercel"
echo "3. Deploy backend to Railway"
echo "4. Set up production database"
echo "5. Test everything thoroughly"
echo ""
echo "📖 See DEPLOYMENT_INSTRUCTIONS.md for detailed steps"
echo ""
echo "🚀 Ready to launch aroundmenowapp.com!" 