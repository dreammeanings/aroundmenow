#!/usr/bin/env node

const fetch = require('node-fetch');

async function monitorDomain() {
  console.log('🔍 Monitoring aroundmenowapp.com domain...\n');
  console.log('⏰ This will check every 30 minutes. Press Ctrl+C to stop.\n');

  const checkDomain = async () => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\n🕐 [${timestamp}] Checking domain...`);

    try {
      // Test main domain
      const mainResponse = await fetch('https://aroundmenowapp.com/health', { 
        timeout: 5000 
      });
      
      if (mainResponse.ok) {
        console.log('✅ Main domain is responding!');
      } else {
        console.log('⚠️  Main domain not ready yet...');
      }

      // Test API subdomain
      const apiResponse = await fetch('https://api.aroundmenowapp.com/health', { 
        timeout: 5000 
      });
      
      if (apiResponse.ok) {
        console.log('✅ API subdomain is responding!');
      } else {
        console.log('⚠️  API subdomain not ready yet...');
      }

    } catch (error) {
      console.log('❌ Domain not responding yet...');
    }

    console.log('⏰ Next check in 30 minutes...\n');
  };

  // Check immediately
  await checkDomain();

  // Check every 30 minutes
  setInterval(checkDomain, 30 * 60 * 1000);
}

monitorDomain().catch(console.error); 