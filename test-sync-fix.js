const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testSyncFix() {
  console.log('🧪 Testing Sync Fix for Saved State\n');

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

    // 2. Get initial user data
    console.log('\n2️⃣ Getting initial user data...');
    const initialUserResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (initialUserResponse.ok) {
      const initialUserData = await initialUserResponse.json();
      console.log('✅ Initial user data retrieved');
      console.log('📊 Initial notification settings:', initialUserData.user.notificationSettings);
    }

    // 3. Test Notification Settings Save
    console.log('\n3️⃣ Testing Notification Settings Save...');
    const notificationResponse = await fetch(`${BASE_URL}/api/notifications/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        push: true,
        email: false,
        weeklyDigest: true
      })
    });

    if (notificationResponse.ok) {
      console.log('✅ Notification settings saved successfully');
      console.log('📊 Button should now show "✅ Saved" after save');
    } else {
      const errorText = await notificationResponse.text();
      console.log('❌ Notification settings failed:', errorText);
    }

    // 4. Verify the saved state by getting user data
    console.log('\n4️⃣ Verifying saved state...');
    const userResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ User data retrieved successfully');
      console.log('📊 Updated notification settings:', userData.user.notificationSettings);
      console.log('📊 Expected: push: true, email: false, weeklyDigest: true');
      
      const settings = userData.user.notificationSettings;
      if (settings.push === true && settings.email === false && settings.weeklyDigest === true) {
        console.log('✅ Settings match expected values - sync fix should be working!');
      } else {
        console.log('❌ Settings do not match expected values');
      }
    } else {
      console.log('❌ Failed to get user data');
    }

    console.log('\n🎉 Sync fix test completed!');
    console.log('\n📋 Expected Behavior:');
    console.log('✅ After saving: Button shows "✅ Saved"');
    console.log('🔄 When changes detected: Button shows "💾 Save Settings"');
    console.log('⏳ While saving: Button shows "💾 Saving..."');
    console.log('🔄 Local state syncs with user data after refresh');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSyncFix(); 