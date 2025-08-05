const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testCalendarSync() {
  console.log('🧪 Testing Calendar Sync Functionality\n');

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

    // 2. Test Calendar Sync Settings
    console.log('\n2️⃣ Testing Calendar Sync Settings...');
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
      console.log('✅ Calendar sync settings saved successfully');
    } else {
      const errorText = await notificationResponse.text();
      console.log('❌ Calendar sync settings failed:', errorText);
    }

    // 3. Verify Calendar Sync Settings
    console.log('\n3️⃣ Verifying Calendar Sync Settings...');
    const userResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ User data retrieved successfully');
      console.log('📊 Notification Settings:', userData.user.notificationSettings);
      
      const settings = userData.user.notificationSettings;
      if (settings.calendarSync === true) {
        console.log('✅ Calendar sync setting verified successfully!');
      } else {
        console.log('❌ Calendar sync setting not found or incorrect');
      }
    } else {
      console.log('❌ Failed to get user data');
    }

    console.log('\n🎉 Calendar sync functionality test completed!');
    console.log('\n📋 Expected Behavior:');
    console.log('✅ Calendar sync toggle appears in notification settings');
    console.log('✅ Calendar sync setting saves to backend');
    console.log('✅ Calendar sync setting persists after refresh');
    console.log('✅ Calendar sync works with device calendar permissions');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCalendarSync(); 