const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testAllScreensSavedState() {
  console.log('🧪 Testing Saved State Across All Screens\n');

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

    // 3. Test Location Settings
    console.log('\n3️⃣ Testing Location Settings...');
    const locationResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        locationEnabled: true,
        locationPrecision: 'medium',
        radius: 35
      })
    });

    if (locationResponse.ok) {
      console.log('✅ Location settings saved successfully');
    } else {
      const errorText = await locationResponse.text();
      console.log('❌ Location settings failed:', errorText);
    }

    // 4. Test Privacy Settings
    console.log('\n4️⃣ Testing Privacy Settings...');
    const privacyResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        profileVisibility: 'private',
        dataSharing: true,
        analyticsEnabled: false,
        twoFactorAuth: true,
        loginNotifications: false
      })
    });

    if (privacyResponse.ok) {
      console.log('✅ Privacy settings saved successfully');
    } else {
      const errorText = await privacyResponse.text();
      console.log('❌ Privacy settings failed:', errorText);
    }

    // 5. Test Profile Settings
    console.log('\n5️⃣ Testing Profile Settings...');
    const profileResponse = await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test User Updated',
        bio: 'Testing saved state across all screens',
        phonePrivacy: true
      })
    });

    if (profileResponse.ok) {
      console.log('✅ Profile settings saved successfully');
    } else {
      const errorText = await profileResponse.text();
      console.log('❌ Profile settings failed:', errorText);
    }

    // 6. Verify All Settings
    console.log('\n6️⃣ Verifying All Settings...');
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
      console.log('📊 Profile:', {
        name: userData.user.name,
        bio: userData.user.bio,
        phonePrivacy: userData.user.phonePrivacy
      });
    } else {
      console.log('❌ Failed to get user data');
    }

    console.log('\n🎉 All screens test completed!');
    console.log('\n📋 Expected Behavior:');
    console.log('✅ After saving: Button shows "✅ Saved"');
    console.log('🔄 When changes detected: Button shows "💾 Save Settings"');
    console.log('⏳ While saving: Button shows "💾 Saving..."');
    console.log('🔄 Local state syncs with user data after refresh');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAllScreensSavedState(); 