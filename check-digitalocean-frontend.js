#!/usr/bin/env node

const fetch = require('node-fetch');

async function checkDigitalOceanFrontend() {
  console.log('🔍 Checking Around Me Now Frontend URLs...\n');

  // Test the DigitalOcean app URLs
  const possibleUrls = [
    // Your custom domain
    'https://aroundmenowapp.com',
    'http://aroundmenowapp.com',
    
    // DigitalOcean generated URLs (frontend service)
    'https://aroundmenow-lr47g.ondigitalocean.app',
    'http://aroundmenow-lr47g.ondigitalocean.app',
    
    // Alternative patterns for frontend
    'https://around-me-now-frontend.ondigitalocean.app',
    'https://aroundmenow-frontend.ondigitalocean.app',
    
    // Backend health check (should work)
    'https://aroundmenow-lr47g.ondigitalocean.app/health'
  ];

  console.log('🔗 Testing frontend URLs...\n');

  for (const url of possibleUrls) {
    try {
      console.log(`Testing: ${url}`);
      const response = await fetch(url, { 
        timeout: 8000,
        headers: {
          'User-Agent': 'Around-Me-Now-Frontend-Checker/1.0'
        }
      });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        console.log(`✅ SUCCESS: ${url}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Content-Type: ${contentType}`);
        
        if (contentType && contentType.includes('text/html')) {
          console.log(`   📱 This appears to be the frontend (HTML)`);
        } else if (contentType && contentType.includes('application/json')) {
          console.log(`   🔧 This appears to be the backend (JSON)`);
        }
        console.log('');
      } else {
        console.log(`⚠️  PARTIAL: ${url} (Status: ${response.status})\n`);
      }
    } catch (error) {
      console.log(`❌ FAILED: ${url}`);
      console.log(`   Error: ${error.message}\n`);
    }
  }

  console.log('📋 Analysis:');
  console.log('');
  console.log('🔧 Backend Status:');
  console.log('   - API endpoints should return JSON');
  console.log('   - Health check should work');
  console.log('');
  console.log('📱 Frontend Status:');
  console.log('   - Should return HTML content');
  console.log('   - Should serve your React Native web app');
  console.log('');
  console.log('🎯 Next Steps:');
  console.log('   1. Check DigitalOcean dashboard for frontend service');
  console.log('   2. Verify frontend build is successful');
  console.log('   3. Configure domain routing to frontend service');
}

checkDigitalOceanFrontend().catch(console.error); 