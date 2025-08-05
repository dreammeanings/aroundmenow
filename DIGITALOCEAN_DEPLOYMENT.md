# DigitalOcean Deployment Guide for Around Me Now

## Overview
Your app consists of:
- **Frontend**: React Native/Expo app (mobile + web)
- **Backend**: Node.js/Express API with PostgreSQL
- **Current**: Running on Railway

## Deployment Options

### Option 1: DigitalOcean App Platform (Recommended)

**Pros**: 
- Managed platform, easy deployment
- Automatic SSL certificates
- Built-in database
- Automatic scaling
- GitHub integration

**Steps**:

1. **Prepare your repository**:
   ```bash
   # Make sure your repo is on GitHub
   git remote add origin https://github.com/your-username/around-me-now.git
   git push -u origin main
   ```

2. **Create DigitalOcean App**:
   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Connect your GitHub repository
   - Select the `do-app.yaml` configuration file

3. **Set Environment Variables**:
   In the DigitalOcean dashboard, add these environment variables:
   ```
   JWT_SECRET=your-super-secure-production-jwt-secret-key
   DATABASE_URL=postgresql://username:password@host:port/database
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
   STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   EXPO_ACCESS_TOKEN=your-expo-access-token
   ```

4. **Deploy**:
   - DigitalOcean will automatically build and deploy your app
   - Backend will be available at: `https://around-me-now-backend.ondigitalocean.app`
   - Frontend will be available at: `https://around-me-now-frontend.ondigitalocean.app`

### Option 2: DigitalOcean Droplets (More Control)

**Pros**: 
- Full control over server
- More cost-effective for high traffic
- Custom configurations

**Steps**:

1. **Create a Droplet**:
   ```bash
   # Create Ubuntu 22.04 LTS droplet
   # Minimum specs: 2GB RAM, 1 vCPU
   ```

2. **Install Dependencies**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib -y
   
   # Install PM2 for process management
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

3. **Setup Database**:
   ```bash
   # Create database and user
   sudo -u postgres psql
   CREATE DATABASE aroundmenow;
   CREATE USER aroundmenow WITH PASSWORD 'your-secure-password';
   GRANT ALL PRIVILEGES ON DATABASE aroundmenow TO aroundmenow;
   \q
   ```

4. **Deploy Backend**:
   ```bash
   # Clone your repository
   git clone https://github.com/your-username/around-me-now.git
   cd around-me-now/backend
   
   # Install dependencies
   npm install
   
   # Create production environment file
   cp .env.example .env.production
   # Edit .env.production with your production values
   
   # Run migrations
   npm run migrate
   
   # Start with PM2
   pm2 start src/index.js --name "around-me-now-backend"
   pm2 startup
   pm2 save
   ```

5. **Setup Nginx**:
   ```bash
   # Create Nginx configuration
   sudo nano /etc/nginx/sites-available/around-me-now
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # Enable the site
   sudo ln -s /etc/nginx/sites-available/around-me-now /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Setup SSL with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com
   ```

### Option 3: DigitalOcean Managed Database + App Platform

**Best of both worlds**:
- Use DigitalOcean's managed PostgreSQL database
- Deploy backend to App Platform
- Deploy frontend to App Platform

**Steps**:

1. **Create Managed Database**:
   - Go to DigitalOcean Databases
   - Create PostgreSQL cluster
   - Note the connection string

2. **Update App Configuration**:
   - Use the managed database connection string
   - Remove the database section from `do-app.yaml`

## Migration from Railway

If you're currently on Railway and want to migrate:

1. **Export Environment Variables**:
   ```bash
   # Copy all environment variables from Railway dashboard
   # to DigitalOcean App Platform environment variables
   ```

2. **Update Frontend API URL**:
   ```javascript
   // Update your frontend configuration to point to new backend URL
   const API_BASE_URL = 'https://around-me-now-backend.ondigitalocean.app';
   ```

3. **Update Database**:
   - Export data from Railway PostgreSQL
   - Import to DigitalOcean managed database

## Cost Estimation

**App Platform** (Recommended):
- Backend: $5/month (basic-xxs)
- Frontend: $5/month (basic-xxs)
- Database: $15/month (db-s-1vcpu-1gb)
- **Total: ~$25/month**

**Droplet** (More Control):
- Droplet: $12/month (2GB RAM, 1 vCPU)
- Managed Database: $15/month
- **Total: ~$27/month**

## Next Steps

1. Choose your deployment option
2. Set up your DigitalOcean account
3. Configure environment variables
4. Deploy your application
5. Test all functionality
6. Update your domain DNS if you have a custom domain

## Troubleshooting

**Common Issues**:
- Port conflicts: Make sure your app listens on `process.env.PORT`
- Database connections: Verify DATABASE_URL format
- CORS issues: Update CORS_ORIGIN to your frontend URL
- Environment variables: Double-check all required variables are set

**Useful Commands**:
```bash
# Check app logs (App Platform)
doctl apps logs your-app-id

# Check PM2 logs (Droplet)
pm2 logs around-me-now-backend

# Check Nginx logs (Droplet)
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
``` 