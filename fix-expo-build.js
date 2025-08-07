#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Expo build configuration...\n');

// Read the current app.json
const appJsonPath = path.join(process.cwd(), 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

console.log('📋 Current app.json configuration:');
console.log(JSON.stringify(appJson, null, 2));

// Check if Hermes is enabled
if (appJson.expo && appJson.expo.jsEngine === 'hermes') {
  console.log('\n⚠️  Hermes is enabled in app.json');
  console.log('💡 This might be causing the build issues');
  
  // Create a backup
  fs.writeFileSync('app.json.backup', JSON.stringify(appJson, null, 2));
  console.log('✅ Created backup: app.json.backup');
  
  // Temporarily disable Hermes for web builds
  if (appJson.expo.ios) {
    delete appJson.expo.ios.jsEngine;
  }
  if (appJson.expo.android) {
    delete appJson.expo.android.jsEngine;
  }
  
  // Save the modified app.json
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
  console.log('✅ Modified app.json to remove Hermes configuration');
  
  console.log('\n📋 Updated app.json configuration:');
  console.log(JSON.stringify(appJson, null, 2));
  
  console.log('\n🎯 Next steps:');
  console.log('1. Try deploying with the updated configuration');
  console.log('2. If it still fails, we can try other approaches');
  console.log('3. You can restore the backup with: cp app.json.backup app.json');
  
} else {
  console.log('\n✅ Hermes is not explicitly enabled');
  console.log('🔍 The build issue might be something else');
  
  console.log('\n🎯 Alternative solutions:');
  console.log('1. Try using a different build command');
  console.log('2. Use a pre-built web version');
  console.log('3. Create a custom web build script');
}

console.log('\n📞 Would you like to try the updated configuration?'); 