const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testSaveFunctionality() {
  console.log('🧪 Testing Save Functionality\n');

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

    // 2. Test Profile Update (basic fields)
    console.log('\n2️⃣ Testing Profile Update...');
    const profileUpdateResponse = await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Updated Test User',
        phone: '+1234567890'
      })
    });

    if (!profileUpdateResponse.ok) {
      const errorText = await profileUpdateResponse.text();
      console.log('❌ Profile update failed:', errorText);
    } else {
      console.log('✅ Profile update successful');
    }

    // 3. Test Preferences Update
    console.log('\n3️⃣ Testing Preferences Update...');
    const preferencesUpdateResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        locationEnabled: true,
        locationPrecision: 'high',
        profileVisibility: 'public',
        dataSharing: true,
        analyticsEnabled: true,
        twoFactorAuth: false,
        loginNotifications: true
      })
    });

    if (!preferencesUpdateResponse.ok) {
      const errorText = await preferencesUpdateResponse.text();
      console.log('❌ Preferences update failed:', errorText);
    } else {
      console.log('✅ Preferences update successful');
    }

    // 4. Test Notification Settings Update
    console.log('\n4️⃣ Testing Notification Settings Update...');
    const notificationUpdateResponse = await fetch(`${BASE_URL}/api/notifications/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        push: true,
        email: true,
        weeklyDigest: false,
        eventReminders: true,
        friendActivity: true,
        geofenceAlerts: false
      })
    });

    if (!notificationUpdateResponse.ok) {
      const errorText = await notificationUpdateResponse.text();
      console.log('❌ Notification settings update failed:', errorText);
    } else {
      console.log('✅ Notification settings update successful');
    }

    // 5. Verify all updates by getting current user
    console.log('\n5️⃣ Verifying updates...');
    const userResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ User data retrieved successfully');
      console.log('📊 Current user data:', JSON.stringify(userData, null, 2));
    } else {
      console.log('❌ Failed to get user data');
    }

    console.log('\n🎉 All save functionality tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSaveFunctionality(); 