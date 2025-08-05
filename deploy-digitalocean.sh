#!/bin/bash

# DigitalOcean Deployment Script for Around Me Now
# This script helps prepare your app for DigitalOcean deployment

echo "🚀 Preparing Around Me Now for DigitalOcean deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the root of your around-me-now project"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for DigitalOcean deployment"
fi

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Please set up your GitHub remote:"
    echo "   git remote add origin https://github.com/your-username/around-me-now.git"
    echo "   git push -u origin main"
fi

# Create production build script for frontend
echo "📝 Creating production build script..."
cat > build-web.sh << 'EOF'
#!/bin/bash
echo "🏗️  Building web version..."
npm install
npm run build:web
echo "✅ Web build complete!"
EOF

chmod +x build-web.sh

# Create deployment checklist
echo "📋 Creating deployment checklist..."
cat > DEPLOYMENT_CHECKLIST.md << 'EOF'
# DigitalOcean Deployment Checklist

## Pre-Deployment
- [ ] Push code to GitHub
- [ ] Set up DigitalOcean account
- [ ] Create App Platform app
- [ ] Configure environment variables

## Environment Variables to Set
- [ ] JWT_SECRET
- [ ] DATABASE_URL
- [ ] AWS_ACCESS_KEY_ID
- [ ] AWS_SECRET_ACCESS_KEY
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_PUBLISHABLE_KEY
- [ ] SMTP_USER
- [ ] SMTP_PASS
- [ ] GOOGLE_MAPS_API_KEY
- [ ] EXPO_ACCESS_TOKEN

## Post-Deployment
- [ ] Test backend API endpoints
- [ ] Test frontend functionality
- [ ] Verify database connections
- [ ] Check SSL certificates
- [ ] Test mobile app with new backend URL

## URLs to Update
- [ ] Frontend API base URL
- [ ] CORS origins
- [ ] Mobile app configuration
EOF

# Check backend configuration
echo "🔍 Checking backend configuration..."
if [ -f "backend/.env.production" ]; then
    echo "✅ Production environment file exists"
else
    echo "⚠️  Warning: backend/.env.production not found"
    echo "   Copy backend/.env.example to backend/.env.production and update values"
fi

# Check if all required files exist
echo "📁 Checking required files..."
required_files=(
    "backend/package.json"
    "backend/src/index.js"
    "backend/knexfile.js"
    "package.json"
    "do-app.yaml"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

echo ""
echo "🎉 Preparation complete!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add . && git commit -m 'Prepare for DigitalOcean deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to DigitalOcean App Platform:"
echo "   https://cloud.digitalocean.com/apps"
echo ""
echo "3. Create a new app and connect your GitHub repository"
echo ""
echo "4. Use the do-app.yaml configuration file"
echo ""
echo "5. Set all environment variables in the DigitalOcean dashboard"
echo ""
echo "6. Deploy and test your application"
echo ""
echo "📖 See DIGITALOCEAN_DEPLOYMENT.md for detailed instructions" 