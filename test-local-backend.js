#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

async function testLocalBackend() {
  console.log('🧪 Testing Around Me Now Backend Locally...\n');

  // Check if backend directory exists
  const backendPath = path.join(process.cwd(), 'backend');
  if (!require('fs').existsSync(backendPath)) {
    console.log('❌ Backend directory not found!');
    return;
  }

  console.log('📁 Backend directory found');
  console.log('📦 Checking dependencies...\n');

  // Test npm install
  console.log('🔧 Running npm install...');
  const install = spawn('npm', ['install'], { 
    cwd: backendPath,
    stdio: 'pipe'
  });

  install.stdout.on('data', (data) => {
    console.log(`📦 ${data.toString().trim()}`);
  });

  install.stderr.on('data', (data) => {
    console.log(`⚠️  ${data.toString().trim()}`);
  });

  await new Promise((resolve) => {
    install.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Dependencies installed successfully\n');
      } else {
        console.log('❌ Failed to install dependencies\n');
      }
      resolve();
    });
  });

  // Test if the app can start (with a timeout)
  console.log('🚀 Testing app startup...');
  console.log('⏰ Starting server (will timeout after 10 seconds)...\n');

  const app = spawn('node', ['src/index.js'], { 
    cwd: backendPath,
    stdio: 'pipe',
    env: {
      ...process.env,
      NODE_ENV: 'development',
      PORT: '3001', // Use different port to avoid conflicts
      JWT_SECRET: 'test-secret',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      FRONTEND_URL: 'http://localhost:8081',
      CORS_ORIGIN: 'http://localhost:8081'
    }
  });

  let startupSuccess = false;
  let startupError = '';

  app.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`📝 ${output.trim()}`);
    
    if (output.includes('server running on port')) {
      startupSuccess = true;
      console.log('✅ Server started successfully!');
    }
  });

  app.stderr.on('data', (data) => {
    const error = data.toString();
    console.log(`❌ ${error.trim()}`);
    startupError += error;
  });

  // Wait 10 seconds then kill the process
  setTimeout(() => {
    app.kill();
    console.log('\n⏰ Test timeout reached');
    
    if (startupSuccess) {
      console.log('✅ Backend can start successfully!');
      console.log('💡 The issue is likely in the DigitalOcean deployment configuration.');
    } else {
      console.log('❌ Backend failed to start');
      console.log('🔍 Common issues:');
      console.log('   - Missing environment variables');
      console.log('   - Database connection issues');
      console.log('   - Port conflicts');
      console.log('   - Missing dependencies');
      console.log('');
      console.log('📋 Check the error messages above for specific issues.');
    }
  }, 10000);

  app.on('close', (code) => {
    if (code !== 0 && !startupSuccess) {
      console.log(`❌ Process exited with code ${code}`);
    }
  });
}

testLocalBackend().catch(console.error); 