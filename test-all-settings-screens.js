const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testAllSettingsScreens() {
  console.log('🧪 Testing All Settings Screens Save Functionality\n');

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

    // 2. Test Notification Settings
    console.log('\n2️⃣ Testing Notification Settings...');
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
    } else {
      const errorText = await notificationResponse.text();
      console.log('❌ Notification settings failed:', errorText);
    }

    // 3. Test Location Settings (Preferences)
    console.log('\n3️⃣ Testing Location Settings...');
    const locationResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        locationEnabled: true,
        locationPrecision: 'high',
        radius: 30,
        defaultRadius: 30
      })
    });

    if (locationResponse.ok) {
      console.log('✅ Location settings saved successfully');
    } else {
      const errorText = await locationResponse.text();
      console.log('❌ Location settings failed:', errorText);
    }

    // 4. Test Privacy & Security Settings
    console.log('\n4️⃣ Testing Privacy & Security Settings...');
    const privacyResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        profileVisibility: 'friends',
        dataSharing: false,
        analyticsEnabled: true,
        twoFactorAuth: true,
        loginNotifications: false
      })
    });

    if (privacyResponse.ok) {
      console.log('✅ Privacy & Security settings saved successfully');
    } else {
      const errorText = await privacyResponse.text();
      console.log('❌ Privacy & Security settings failed:', errorText);
    }

    // 5. Verify All Settings Were Saved
    console.log('\n5️⃣ Verifying All Settings Were Saved...');
    const userResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ User data retrieved successfully');
      console.log('📊 Notification Settings:', userData.user.notificationSettings);
      console.log('📊 Preferences:', userData.user.preferences);
    } else {
      console.log('❌ Failed to get user data');
    }

    console.log('\n🎉 All settings screens save functionality test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAllSettingsScreens(); 