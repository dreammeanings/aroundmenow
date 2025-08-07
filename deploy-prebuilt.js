#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building your app locally...\n');

try {
  // Build the app locally
  console.log('📦 Building React Native web app...');
  execSync('npm run build:web', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  
  // Create a simple deployment configuration
  const deployConfig = `name: around-me-now-frontend
region: nyc
services:
  - name: frontend
    run_command: npx serve dist -l 8080
    environment_slug: node-js
    http_port: 8080
    source_dir: /
    instance_count: 1
    instance_size_slug: basic-xxs
    github:
      repo: dreammeanings/aroundmenow
      branch: main
    envs:
      - key: REACT_APP_API_URL
        value: https://api.aroundmenowapp.com
        scope: RUN_AND_BUILD_TIME
ingress:
  rules:
    - match:
        path:
          prefix: /
      component:
        name: frontend`;

  // Write the deployment config
  fs.writeFileSync('do-prebuilt.yaml', deployConfig);
  
  console.log('\n📋 Next Steps:');
  console.log('1. Copy the dist/ folder to your GitHub repository');
  console.log('2. Use the do-prebuilt.yaml configuration in DigitalOcean');
  console.log('3. Deploy - it will serve your pre-built app instantly');
  
  console.log('\n🎯 Alternative: Use a different hosting service');
  console.log('- Vercel: Great for React apps');
  console.log('- Netlify: Easy static site deployment');
  console.log('- GitHub Pages: Free hosting');
  
} catch (error) {
  console.log('❌ Build failed:', error.message);
  console.log('\n🔧 Alternative solutions:');
  console.log('1. Upgrade DigitalOcean to a larger plan');
  console.log('2. Use a different hosting service');
  console.log('3. Create a simpler version of your app');
} 