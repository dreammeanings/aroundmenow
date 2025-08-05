#!/bin/bash

# 🚀 Production Backend Deployment Script for aroundmenowapp.com
# This script will help you deploy your backend to Railway

echo "🚀 Around Me Now Production Backend Deployment"
echo "Domain: aroundmenowapp.com"
echo ""

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Step 1: Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
    echo "✅ Railway CLI installed"
else
    echo "✅ Railway CLI already installed"
fi

echo ""

# Step 2: Check if user is logged into Railway
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway..."
    railway login
else
    echo "✅ Already logged into Railway"
fi

echo ""

# Step 3: Create production environment file
echo "📝 Creating production environment template..."
cat > backend/.env.production << EOF
# Production Environment Variables for aroundmenowapp.com
# Copy these to Railway dashboard

# Server Configuration
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://aroundmenowapp.com

# Database Configuration (Railway will provide)
DATABASE_URL=postgresql://username:password@host:port/database

# JWT Configuration
JWT_SECRET=your-super-secure-production-jwt-secret-key
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=https://aroundmenowapp.com

# Optional Services (add as needed)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=around-me-now-images

STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

GOOGLE_MAPS_API_KEY=your-google-maps-api-key
EXPO_ACCESS_TOKEN=your-expo-access-token
EOF

echo "✅ Created .env.production template"
echo ""

# Step 4: Create deployment instructions
echo "📋 Creating deployment instructions..."
cat > DEPLOYMENT_STEPS.md << EOF
# 🚀 Railway Deployment Steps

## Step 1: Deploy to Railway

1. **Go to Railway Dashboard:**
   - Visit https://railway.app
   - Sign in with GitHub
   - Create new project

2. **Connect Repository:**
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect the backend

3. **Add PostgreSQL Database:**
   - In Railway dashboard, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will provide DATABASE_URL

4. **Set Environment Variables:**
   - Copy variables from backend/.env.production
   - Paste into Railway environment variables
   - Update with your actual values

5. **Deploy:**
   - Railway will auto-deploy on push
   - Or manually trigger deployment

## Step 2: Get Your API URL

After deployment, Railway will provide:
- **API URL**: https://your-app-name.up.railway.app
- **Health Check**: https://your-app-name.up.railway.app/health

## Step 3: Configure DNS

Add these DNS records:
- **A Record**: api.aroundmenowapp.com → Railway IP
- **CNAME**: www.aroundmenowapp.com → aroundmenowapp.com

## Step 4: Test Deployment

\`\`\`bash
# Test health endpoint
curl https://your-app-name.up.railway.app/health

# Test authentication
curl -X POST https://your-app-name.up.railway.app/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"password123"}'
\`\`\`

## Step 5: Update Frontend

Update your frontend API URL:
\`\`\`typescript
// src/services/apiService.ts
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.aroundmenowapp.com'
  : 'http://localhost:3000';
\`\`\`

## Step 6: Deploy Frontend

\`\`\`bash
# Deploy to Vercel
vercel --prod

# Add custom domain
vercel domains add aroundmenowapp.com
\`\`\`

🎉 Your app will be live at https://aroundmenowapp.com!
EOF

echo "✅ Created DEPLOYMENT_STEPS.md"
echo ""

# Step 5: Check if backend is ready for deployment
echo "🔍 Checking backend readiness..."

# Check if all required files exist
if [ -f "backend/railway.json" ]; then
    echo "✅ Railway configuration found"
else
    echo "❌ Railway configuration missing"
fi

if [ -f "backend/package.json" ]; then
    echo "✅ Package.json found"
else
    echo "❌ Package.json missing"
fi

if [ -f "backend/src/index.js" ]; then
    echo "✅ Main server file found"
else
    echo "❌ Main server file missing"
fi

echo ""

# Step 6: Show next steps
echo "🎯 NEXT STEPS:"
echo ""
echo "1. 📋 Read DEPLOYMENT_STEPS.md for detailed instructions"
echo "2. 🌐 Go to https://railway.app and create new project"
echo "3. 🔗 Connect your GitHub repository"
echo "4. ⚙️  Set environment variables in Railway dashboard"
echo "5. 🚀 Deploy and get your API URL"
echo "6. 🌍 Configure DNS for aroundmenowapp.com"
echo "7. 📱 Update frontend with new API URL"
echo "8. 🎉 Launch your app!"
echo ""

echo "✅ Production deployment preparation complete!"
echo ""
echo "📖 See DEPLOYMENT_STEPS.md for detailed instructions"
echo "🚀 Ready to deploy to Railway!" 