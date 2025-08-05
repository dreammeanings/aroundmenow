# Quick Start: Deploy to DigitalOcean

## 🚀 Fast Deployment (5 minutes)

### 1. Run the deployment script
```bash
./deploy-digitalocean.sh
```

### 2. Push to GitHub
```bash
git add .
git commit -m "Prepare for DigitalOcean deployment"
git push origin main
```

### 3. Deploy on DigitalOcean
1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your GitHub repository
4. Select the `do-app.yaml` configuration file
5. Set environment variables (see checklist below)
6. Deploy!

## 📋 Environment Variables Checklist

Copy these from your Railway dashboard to DigitalOcean:

**Required:**
- `JWT_SECRET` - Your JWT secret key
- `DATABASE_URL` - PostgreSQL connection string
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `GOOGLE_MAPS_API_KEY` - Google Maps API key
- `EXPO_ACCESS_TOKEN` - Expo access token

**Optional:**
- `SMTP_USER` - Email for notifications
- `SMTP_PASS` - Email password

## 🔗 Your App URLs

After deployment, your app will be available at:
- **Backend API**: `https://around-me-now-backend.ondigitalocean.app`
- **Frontend Web**: `https://around-me-now-frontend.ondigitalocean.app`

## 📱 Update Mobile App

Update your mobile app's API URL to point to the new backend:
```javascript
// In your app configuration
const API_BASE_URL = 'https://around-me-now-backend.ondigitalocean.app';
```

## 💰 Cost

- **Backend**: $5/month
- **Frontend**: $5/month  
- **Database**: $15/month
- **Total**: ~$25/month

## 🆘 Need Help?

- See `DIGITALOCEAN_DEPLOYMENT.md` for detailed instructions
- Check `DEPLOYMENT_CHECKLIST.md` for step-by-step checklist
- DigitalOcean support: https://www.digitalocean.com/support/

## 🔄 Migration from Railway

If you're moving from Railway:

1. Export your data from Railway PostgreSQL
2. Import to DigitalOcean managed database
3. Update your frontend API URL
4. Test all functionality
5. Update DNS if you have a custom domain 