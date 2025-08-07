#!/usr/bin/env node

const fetch = require('node-fetch');

async function testDomain() {
  console.log('🧪 Testing aroundmenowapp.com domain...\n');

  const endpoints = [
    'https://aroundmenowapp.com/health',
    'https://api.aroundmenowapp.com/health',
    'http://aroundmenowapp.com/health',
    'http://api.aroundmenowapp.com/health'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const response = await fetch(endpoint, { timeout: 5000 });
      
      if (response.ok) {
        const data = await response.text();
        console.log(`✅ SUCCESS: ${endpoint}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${data.substring(0, 100)}...\n`);
      } else {
        console.log(`⚠️  PARTIAL: ${endpoint} (Status: ${response.status})\n`);
      }
    } catch (error) {
      console.log(`❌ FAILED: ${endpoint}`);
      console.log(`   Error: ${error.message}\n`);
    }
  }

  console.log('🎯 Domain test complete!');
  console.log('📝 If all tests fail, DNS propagation may still be in progress.');
  console.log('⏰ DNS changes can take 24-48 hours to propagate globally.');
}

testDomain().catch(console.error); 