#!/usr/bin/env node

const fetch = require('node-fetch');

async function checkDeploymentStatus() {
  console.log('🔍 Checking Around Me Now Deployment Status...\n');

  const endpoints = [
    {
      name: 'Main Domain (HTTPS)',
      url: 'https://aroundmenowapp.com/health',
      expected: 'Health check endpoint'
    },
    {
      name: 'Main Domain (HTTP)',
      url: 'http://aroundmenowapp.com/health',
      expected: 'Health check endpoint'
    },
    {
      name: 'API Subdomain (HTTPS)',
      url: 'https://api.aroundmenowapp.com/health',
      expected: 'API health check'
    },
    {
      name: 'API Subdomain (HTTP)',
      url: 'http://api.aroundmenowapp.com/health',
      expected: 'API health check'
    }
  ];

  console.log('📊 Testing endpoints...\n');

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint.name}`);
      const response = await fetch(endpoint.url, { 
        timeout: 10000,
        headers: {
          'User-Agent': 'Around-Me-Now-Deployment-Checker/1.0'
        }
      });
      
      if (response.ok) {
        const data = await response.text();
        console.log(`✅ SUCCESS: ${endpoint.name}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${data.substring(0, 150)}...\n`);
      } else {
        console.log(`⚠️  PARTIAL: ${endpoint.name} (Status: ${response.status})`);
        console.log(`   Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}\n`);
      }
    } catch (error) {
      console.log(`❌ FAILED: ${endpoint.name}`);
      console.log(`   Error: ${error.message}`);
      
      // Additional diagnostics
      if (error.code === 'ENOTFOUND') {
        console.log(`   💡 DNS resolution failed - check domain configuration`);
      } else if (error.code === 'ECONNREFUSED') {
        console.log(`   💡 Connection refused - server not running or port blocked`);
      } else if (error.code === 'ETIMEDOUT') {
        console.log(`   💡 Connection timeout - server overloaded or firewall blocking`);
      }
      console.log('');
    }
  }

  console.log('🔧 Troubleshooting Steps:');
  console.log('');
  console.log('1. Check DigitalOcean App Platform Dashboard:');
  console.log('   https://cloud.digitalocean.com/apps');
  console.log('');
  console.log('2. Verify Environment Variables:');
  console.log('   - JWT_SECRET');
  console.log('   - DATABASE_URL');
  console.log('   - FRONTEND_URL');
  console.log('   - CORS_ORIGIN');
  console.log('');
  console.log('3. Check Build Logs:');
  console.log('   - Look for npm install errors');
  console.log('   - Check for missing dependencies');
  console.log('   - Verify Node.js version compatibility');
  console.log('');
  console.log('4. Check Runtime Logs:');
  console.log('   - Look for application startup errors');
  console.log('   - Check database connection issues');
  console.log('   - Verify port binding (should be 3000)');
  console.log('');
  console.log('5. Common Issues:');
  console.log('   - Missing environment variables');
  console.log('   - Database connection failures');
  console.log('   - CORS configuration problems');
  console.log('   - Port conflicts or firewall rules');
  console.log('');
  console.log('📞 Next Steps:');
  console.log('   - Check the DigitalOcean dashboard for deployment status');
  console.log('   - Review build and runtime logs');
  console.log('   - Verify all environment variables are set');
  console.log('   - Test database connectivity');
}

checkDeploymentStatus().catch(console.error); 