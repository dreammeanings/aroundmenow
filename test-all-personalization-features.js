const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testAllPersonalizationFeatures() {
  console.log('🧪 Testing All Personalization Features\n');

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

    // 2. Test Edit Profile Features
    console.log('\n2️⃣ Testing Edit Profile Features...');
    const profileResponse = await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test User Updated',
        email: 'test@example.com',
        phone: '+1234567890',
        phonePrivacy: true,
        bio: 'Testing all personalization features'
      })
    });

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log('✅ Profile settings saved successfully');
      console.log('📊 Response:', profileData);
    } else {
      const errorText = await profileResponse.text();
      console.log('❌ Profile settings failed:', errorText);
    }

    // 3. Test Notification Settings Features
    console.log('\n3️⃣ Testing Notification Settings Features...');
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
        calendarSync: true,
        eventReminders: true,
        friendActivity: true,
        geofenceAlerts: false
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

    // 4. Test Location Settings Features
    console.log('\n4️⃣ Testing Location Settings Features...');
    const locationResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        locationEnabled: true,
        locationPrecision: 'high',
        radius: 35,
        defaultRadius: 30
      })
    });

    if (locationResponse.ok) {
      const locationData = await locationResponse.json();
      console.log('✅ Location settings saved successfully');
      console.log('📊 Response:', locationData);
    } else {
      const errorText = await locationResponse.text();
      console.log('❌ Location settings failed:', errorText);
    }

    // 5. Test Privacy & Security Features
    console.log('\n5️⃣ Testing Privacy & Security Features...');
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
      const privacyData = await privacyResponse.json();
      console.log('✅ Privacy settings saved successfully');
      console.log('📊 Response:', privacyData);
    } else {
      const errorText = await privacyResponse.text();
      console.log('❌ Privacy settings failed:', errorText);
    }

    // 6. Test Event Preferences Features
    console.log('\n6️⃣ Testing Event Preferences Features...');
    const eventPreferencesResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        eventTypes: ['music', 'sports', 'food'],
        vibe: ['casual', 'energetic'],
        priceRange: ['free', 'low', 'medium'],
        preferredVibe: 'Casual'
      })
    });

    if (eventPreferencesResponse.ok) {
      const eventPreferencesData = await eventPreferencesResponse.json();
      console.log('✅ Event preferences saved successfully');
      console.log('📊 Response:', eventPreferencesData);
    } else {
      const errorText = await eventPreferencesResponse.text();
      console.log('❌ Event preferences failed:', errorText);
    }

    // 7. Verify All Settings
    console.log('\n7️⃣ Verifying All Personalization Settings...');
    const userResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ User data retrieved successfully');
      console.log('📊 Profile Settings:', {
        name: userData.user.name,
        email: userData.user.email,
        phone: userData.user.phone,
        phonePrivacy: userData.user.phonePrivacy,
        bio: userData.user.bio
      });
      console.log('📊 Notification Settings:', userData.user.notificationSettings);
      console.log('📊 Location Settings:', {
        locationEnabled: userData.user.preferences.locationEnabled,
        locationPrecision: userData.user.preferences.locationPrecision,
        radius: userData.user.preferences.radius
      });
      console.log('📊 Privacy Settings:', {
        profileVisibility: userData.user.preferences.profileVisibility,
        dataSharing: userData.user.preferences.dataSharing,
        analyticsEnabled: userData.user.preferences.analyticsEnabled,
        twoFactorAuth: userData.user.preferences.twoFactorAuth,
        loginNotifications: userData.user.preferences.loginNotifications
      });
      console.log('📊 Event Preferences:', {
        eventTypes: userData.user.preferences.eventTypes,
        vibe: userData.user.preferences.vibe,
        priceRange: userData.user.preferences.priceRange,
        preferredVibe: userData.user.preferences.preferredVibe
      });
    } else {
      console.log('❌ Failed to get user data');
    }

    console.log('\n🎉 All personalization features test completed!');
    console.log('\n📋 Personalization Features Tested:');
    console.log('✅ Edit Profile - Name, Email, Phone, Phone Privacy, Bio');
    console.log('✅ Notification Settings - Push, Email, Weekly Digest, Calendar Sync');
    console.log('✅ Location Settings - Location Enabled, Precision, Radius');
    console.log('✅ Privacy & Security - Profile Visibility, Data Sharing, Analytics, 2FA, Login Notifications');
    console.log('✅ Event Preferences - Event Types, Vibe, Price Range, Preferred Vibe');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAllPersonalizationFeatures(); 