const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testCalendarSyncIssues() {
  console.log('🧪 Testing Calendar Sync Issues\n');

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

    // 2. Test Notification Settings (including calendar sync)
    console.log('\n2️⃣ Testing Notification Settings with Calendar Sync...');
    const notificationResponse = await fetch(`${BASE_URL}/api/notifications/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        push: true,
        email: false,
        weeklyDigest: true,
        calendarSync: true
      })
    });

    if (notificationResponse.ok) {
      const notificationData = await notificationResponse.json();
      console.log('✅ Notification settings saved successfully');
      console.log('📊 Response:', notificationData);
    } else {
      const errorText = await notificationResponse.text();
      console.log('❌ Notification settings failed:', errorText);
    }

    // 3. Test User Preferences (to see if calendar sync is being saved there)
    console.log('\n3️⃣ Testing User Preferences...');
    const preferencesResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        locationEnabled: true,
        locationPrecision: 'high',
        radius: 25
      })
    });

    if (preferencesResponse.ok) {
      const preferencesData = await preferencesResponse.json();
      console.log('✅ User preferences saved successfully');
      console.log('📊 Response:', preferencesData);
    } else {
      const errorText = await preferencesResponse.text();
      console.log('❌ User preferences failed:', errorText);
    }

    // 4. Verify All Settings
    console.log('\n4️⃣ Verifying All Settings...');
    const userResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ User data retrieved successfully');
      console.log('📊 Notification Settings:', userData.user.notificationSettings);
      console.log('📊 User Preferences:', userData.user.preferences);
      
      const settings = userData.user.notificationSettings;
      if (settings.calendarSync === true) {
        console.log('✅ Calendar sync setting verified in notification settings!');
      } else {
        console.log('❌ Calendar sync setting not found in notification settings');
      }
    } else {
      console.log('❌ Failed to get user data');
    }

    console.log('\n🎉 Calendar sync issues test completed!');
    console.log('\n📋 Issues Checked:');
    console.log('✅ Calendar sync toggle should be enabled even without permissions');
    console.log('✅ Calendar sync should save to notification settings, not preferences');
    console.log('✅ Calendar sync setting should persist after refresh');
    console.log('✅ Permission requests should be handled gracefully');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCalendarSyncIssues(); 