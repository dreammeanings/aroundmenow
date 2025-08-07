#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function verifyDeploymentConfig() {
  console.log('🔍 Verifying Around Me Now Deployment Configuration...\n');

  const checks = [
    {
      name: 'DigitalOcean App Config',
      file: 'do-app.yaml',
      required: true,
      description: 'Main deployment configuration'
    },
    {
      name: 'Backend Package.json',
      file: 'backend/package.json',
      required: true,
      description: 'Backend dependencies and scripts'
    },
    {
      name: 'Backend Entry Point',
      file: 'backend/src/index.js',
      required: true,
      description: 'Main server file'
    },
    {
      name: 'Frontend Package.json',
      file: 'package.json',
      required: true,
      description: 'Frontend dependencies and scripts'
    },
    {
      name: 'Production Environment',
      file: 'backend/.env.production',
      required: false,
      description: 'Production environment variables template'
    },
    {
      name: 'Database Config',
      file: 'backend/knexfile.js',
      required: true,
      description: 'Database connection configuration'
    },
    {
      name: 'Build Script',
      file: 'build-web.sh',
      required: true,
      description: 'Web build script'
    }
  ];

  let allPassed = true;

  for (const check of checks) {
    const filePath = path.join(process.cwd(), check.file);
    const exists = fs.existsSync(filePath);
    
    if (exists) {
      console.log(`✅ ${check.name}: ${check.file}`);
      console.log(`   ${check.description}`);
      
      // Additional checks for key files
      if (check.file === 'do-app.yaml') {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('around-me-now')) {
          console.log('   ✅ App name configured correctly');
        } else {
          console.log('   ⚠️  App name may need updating');
        }
      }
      
      if (check.file === 'backend/package.json') {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (content.scripts && content.scripts.start) {
          console.log('   ✅ Start script found');
        } else {
          console.log('   ❌ Start script missing');
          allPassed = false;
        }
      }
      
    } else if (check.required) {
      console.log(`❌ ${check.name}: ${check.file} (MISSING)`);
      console.log(`   ${check.description}`);
      allPassed = false;
    } else {
      console.log(`⚠️  ${check.name}: ${check.file} (OPTIONAL)`);
      console.log(`   ${check.description}`);
    }
    console.log('');
  }

  console.log('🔧 Deployment Checklist:');
  console.log('');
  console.log('✅ Required Files:');
  console.log('   - do-app.yaml (DigitalOcean configuration)');
  console.log('   - backend/package.json (Backend dependencies)');
  console.log('   - backend/src/index.js (Server entry point)');
  console.log('   - package.json (Frontend dependencies)');
  console.log('   - backend/knexfile.js (Database config)');
  console.log('   - build-web.sh (Build script)');
  console.log('');
  console.log('🔑 Environment Variables Needed:');
  console.log('   - JWT_SECRET (Required)');
  console.log('   - DATABASE_URL (Required)');
  console.log('   - FRONTEND_URL (Required)');
  console.log('   - CORS_ORIGIN (Required)');
  console.log('   - AWS_ACCESS_KEY_ID (Optional)');
  console.log('   - AWS_SECRET_ACCESS_KEY (Optional)');
  console.log('   - STRIPE_SECRET_KEY (Optional)');
  console.log('   - STRIPE_PUBLISHABLE_KEY (Optional)');
  console.log('   - SMTP_USER (Optional)');
  console.log('   - SMTP_PASS (Optional)');
  console.log('   - GOOGLE_MAPS_API_KEY (Optional)');
  console.log('   - EXPO_ACCESS_TOKEN (Optional)');
  console.log('');
  
  if (allPassed) {
    console.log('✅ All required files are present!');
    console.log('📋 Next steps:');
    console.log('   1. Push code to GitHub');
    console.log('   2. Create DigitalOcean App Platform app');
    console.log('   3. Connect your GitHub repository');
    console.log('   4. Set environment variables in DigitalOcean dashboard');
    console.log('   5. Deploy and monitor logs');
  } else {
    console.log('❌ Some required files are missing!');
    console.log('📋 Please fix the missing files before deploying.');
  }
}

verifyDeploymentConfig(); 