#!/usr/bin/env node

const fetch = require('node-fetch');

async function monitorDomainDNS() {
  console.log('🔍 Monitoring aroundmenowapp.com DNS propagation...\n');
  console.log('⏰ This will check every 5 minutes. Press Ctrl+C to stop.\n');

  const checkDomain = async () => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\n🕐 [${timestamp}] Checking domain...`);

    const endpoints = [
      'https://aroundmenowapp.com/health',
      'http://aroundmenowapp.com/health',
      'https://api.aroundmenowapp.com/health',
      'http://api.aroundmenowapp.com/health'
    ];

    let anySuccess = false;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, { 
          timeout: 10000,
          headers: {
            'User-Agent': 'Around-Me-Now-DNS-Monitor/1.0'
          }
        });
        
        if (response.ok) {
          const data = await response.text();
          console.log(`✅ SUCCESS: ${endpoint}`);
          console.log(`   Status: ${response.status}`);
          console.log(`   Response: ${data.substring(0, 100)}...`);
          anySuccess = true;
        } else {
          console.log(`⚠️  PARTIAL: ${endpoint} (Status: ${response.status})`);
        }
      } catch (error) {
        console.log(`❌ FAILED: ${endpoint}`);
        console.log(`   Error: ${error.message}`);
      }
    }

    if (anySuccess) {
      console.log('\n🎉 Your custom domain is now working!');
      console.log('✅ DNS propagation is complete!');
      process.exit(0);
    } else {
      console.log('\n⏰ Domain not responding yet...');
      console.log('💡 DNS changes can take 5-30 minutes to propagate');
      console.log('📋 Make sure you\'ve configured the DNS records in GoDaddy');
    }

    console.log('⏰ Next check in 5 minutes...\n');
  };

  // Check immediately
  await checkDomain();

  // Check every 5 minutes
  setInterval(checkDomain, 5 * 60 * 1000);
}

monitorDomainDNS().catch(console.error); 