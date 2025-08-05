const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testCalendarSyncDebug() {
  console.log('🧪 Debugging Calendar Sync Endpoints\n');

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

    // 2. Test Notification Settings with Calendar Sync
    console.log('\n2️⃣ Testing Notification Settings with Calendar Sync...');
    console.log('📤 Sending to: /api/notifications/settings');
    console.log('📤 Data:', {
      push: true,
      email: false,
      weeklyDigest: true,
      calendarSync: true
    });
    
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

    console.log('📊 Response Status:', notificationResponse.status);
    console.log('📊 Response Headers:', Object.fromEntries(notificationResponse.headers.entries()));
    
    if (notificationResponse.ok) {
      const notificationData = await notificationResponse.json();
      console.log('✅ Notification settings saved successfully');
      console.log('📊 Response Data:', notificationData);
    } else {
      const errorText = await notificationResponse.text();
      console.log('❌ Notification settings failed:', errorText);
    }

    // 3. Test User Profile (to see if calendar sync is being sent there)
    console.log('\n3️⃣ Testing User Profile...');
    console.log('📤 Sending to: /api/users/profile');
    console.log('📤 Data:', {
      name: 'Test User',
      bio: 'Testing profile update'
    });
    
    const profileResponse = await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test User',
        bio: 'Testing profile update'
      })
    });

    console.log('📊 Response Status:', profileResponse.status);
    console.log('📊 Response Headers:', Object.fromEntries(profileResponse.headers.entries()));
    
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log('✅ Profile updated successfully');
      console.log('📊 Response Data:', profileData);
    } else {
      const errorText = await profileResponse.text();
      console.log('❌ Profile update failed:', errorText);
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
      console.log('📊 User Profile:', {
        name: userData.user.name,
        bio: userData.user.bio,
        phonePrivacy: userData.user.phonePrivacy
      });
      
      const settings = userData.user.notificationSettings;
      if (settings.calendarSync === true) {
        console.log('✅ Calendar sync setting verified in notification settings!');
      } else {
        console.log('❌ Calendar sync setting not found in notification settings');
      }
    } else {
      console.log('❌ Failed to get user data');
    }

    console.log('\n🎉 Calendar sync debug test completed!');
    console.log('\n📋 Debug Summary:');
    console.log('✅ Notification settings should go to /api/notifications/settings');
    console.log('✅ Profile updates should go to /api/users/profile');
    console.log('✅ Calendar sync should be in notification settings, not profile');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCalendarSyncDebug(); 