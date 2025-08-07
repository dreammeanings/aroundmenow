#!/usr/bin/env node

const fetch = require('node-fetch');

async function findDigitalOceanUrls() {
  console.log('🔍 Finding Around Me Now DigitalOcean URLs...\n');

  // Common DigitalOcean App Platform URL patterns
  const possibleUrls = [
    // Standard DigitalOcean App Platform URLs
    'https://around-me-now-backend.ondigitalocean.app/health',
    'https://around-me-now-frontend.ondigitalocean.app',
    'https://around-me-now-backend-1.ondigitalocean.app/health',
    'https://around-me-now-frontend-1.ondigitalocean.app',
    
    // Alternative patterns
    'https://around-me-now.ondigitalocean.app/health',
    'https://around-me-now.ondigitalocean.app',
    'https://aroundmenow-backend.ondigitalocean.app/health',
    'https://aroundmenow-frontend.ondigitalocean.app',
    
    // Your custom domain (if configured)
    'https://aroundmenowapp.com/health',
    'https://api.aroundmenowapp.com/health',
    'https://aroundmenowapp.com',
    'https://api.aroundmenowapp.com'
  ];

  console.log('🔗 Testing possible DigitalOcean URLs...\n');

  for (const url of possibleUrls) {
    try {
      console.log(`Testing: ${url}`);
      const response = await fetch(url, { 
        timeout: 8000,
        headers: {
          'User-Agent': 'Around-Me-Now-URL-Finder/1.0'
        }
      });
      
      if (response.ok) {
        const data = await response.text();
        console.log(`✅ SUCCESS: ${url}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${data.substring(0, 100)}...\n`);
      } else {
        console.log(`⚠️  PARTIAL: ${url} (Status: ${response.status})\n`);
      }
    } catch (error) {
      console.log(`❌ FAILED: ${url}`);
      console.log(`   Error: ${error.message}\n`);
    }
  }

  console.log('📋 Next Steps:');
  console.log('');
  console.log('1. Check your DigitalOcean App Platform dashboard:');
  console.log('   https://cloud.digitalocean.com/apps');
  console.log('');
  console.log('2. Look for the "App URL" or "Live URL" in your app settings');
  console.log('');
  console.log('3. If your custom domain is not working, you may need to:');
  console.log('   - Configure the custom domain in DigitalOcean');
  console.log('   - Update DNS records to point to DigitalOcean');
  console.log('   - Wait for DNS propagation');
  console.log('');
  console.log('4. The app might be accessible via the DigitalOcean-generated URLs');
  console.log('   rather than your custom domain');
}

findDigitalOceanUrls().catch(console.error); 