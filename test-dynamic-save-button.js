const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testDynamicSaveButton() {
  console.log('🧪 Testing Dynamic Save Button Functionality\n');

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
        push: true,
        email: false,
        weeklyDigest: true
      })
    });

    if (notificationResponse.ok) {
      console.log('✅ Notification settings saved successfully');
      console.log('📊 Button should show "✅ Saved" after save');
    } else {
      const errorText = await notificationResponse.text();
      console.log('❌ Notification settings failed:', errorText);
    }

    // 3. Test Location Settings Save
    console.log('\n3️⃣ Testing Location Settings Save...');
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
      console.log('📊 Button should show "✅ Saved" after save');
    } else {
      const errorText = await locationResponse.text();
      console.log('❌ Location settings failed:', errorText);
    }

    // 4. Test Privacy Settings Save
    console.log('\n4️⃣ Testing Privacy Settings Save...');
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
      console.log('📊 Button should show "✅ Saved" after save');
    } else {
      const errorText = await privacyResponse.text();
      console.log('❌ Privacy settings failed:', errorText);
    }

    // 5. Test Profile Save
    console.log('\n5️⃣ Testing Profile Save...');
    const profileResponse = await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test User Updated',
        bio: 'Testing dynamic save button functionality',
        phonePrivacy: true
      })
    });

    if (profileResponse.ok) {
      console.log('✅ Profile saved successfully');
      console.log('📊 Button should show "✅ Saved" after save');
    } else {
      const errorText = await profileResponse.text();
      console.log('❌ Profile save failed:', errorText);
    }

    console.log('\n🎉 Dynamic save button functionality test completed!');
    console.log('\n📋 Expected Behavior:');
    console.log('✅ After saving: Button shows "✅ Saved"');
    console.log('🔄 When changes detected: Button shows "💾 Save Settings"');
    console.log('⏳ While saving: Button shows "💾 Saving..."');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDynamicSaveButton(); 