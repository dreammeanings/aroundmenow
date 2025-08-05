const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testSettingsRefresh() {
  console.log('🧪 Testing Settings Save and Refresh Functionality\n');

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

    // 3. Update notification settings
    console.log('\n3️⃣ Updating notification settings...');
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
      console.log('✅ Notification settings updated successfully');
    } else {
      const errorText = await notificationResponse.text();
      console.log('❌ Notification settings failed:', errorText);
    }

    // 4. Get updated user data to verify changes
    console.log('\n4️⃣ Getting updated user data...');
    const updatedUserResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (updatedUserResponse.ok) {
      const updatedUserData = await updatedUserResponse.json();
      console.log('✅ Updated user data retrieved');
      console.log('📊 Updated notification settings:', updatedUserData.user.notificationSettings);
      
      // Verify the changes were actually saved
      const settings = updatedUserData.user.notificationSettings;
      if (settings.push === false && settings.email === true && settings.weeklyDigest === false) {
        console.log('✅ Changes verified - settings were properly saved!');
      } else {
        console.log('❌ Changes not reflected in user data');
      }
    } else {
      console.log('❌ Failed to get updated user data');
    }

    console.log('\n🎉 Settings refresh functionality test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSettingsRefresh(); 