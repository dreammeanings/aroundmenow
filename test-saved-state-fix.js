const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testSavedStateFix() {
  console.log('🧪 Testing Saved State Fix\n');

  try {
    // 1. Login to get authentication token
    console.log('1️⃣ Logging in...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful');

    // 2. Test Notification Settings Save
    console.log('\n2️⃣ Testing Notification Settings Save...');
    const notificationResponse = await fetch(`${BASE_URL}/api/notifications/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        push: false,
        email: true,
        weeklyDigest: false
      })
    });

    if (notificationResponse.ok) {
      console.log('✅ Notification settings saved successfully');
      console.log('📊 Button should now show "✅ Saved" after save');
    } else {
      const errorText = await notificationResponse.text();
      console.log('❌ Notification settings failed:', errorText);
    }

    // 3. Verify the saved state by getting user data
    console.log('\n3️⃣ Verifying saved state...');
    const userResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ User data retrieved successfully');
      console.log('📊 Notification settings:', userData.user.notificationSettings);
      console.log('📊 Expected: push: false, email: true, weeklyDigest: false');
      
      const settings = userData.user.notificationSettings;
      if (settings.push === false && settings.email === true && settings.weeklyDigest === false) {
        console.log('✅ Settings match expected values - saved state should be working!');
      } else {
        console.log('❌ Settings do not match expected values');
      }
    } else {
      console.log('❌ Failed to get user data');
    }

    console.log('\n🎉 Saved state fix test completed!');
    console.log('\n📋 Expected Behavior:');
    console.log('✅ After saving: Button shows "✅ Saved"');
    console.log('🔄 When changes detected: Button shows "💾 Save Settings"');
    console.log('⏳ While saving: Button shows "💾 Saving..."');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSavedStateFix(); 