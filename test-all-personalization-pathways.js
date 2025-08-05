const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testAllPersonalizationPathways() {
  console.log('🧪 Testing All Personalization Pathways\n');

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

    // 2. Test All Profile Features
    console.log('\n2️⃣ Testing All Profile Features...');
    const profileFeatures = {
      name: 'Test User Complete',
      email: 'test@example.com',
      phone: '+1234567890',
      phonePrivacy: true,
      bio: 'Testing all personalization pathways and features'
    };

    const profileResponse = await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileFeatures)
    });

    if (profileResponse.ok) {
      console.log('✅ Profile features saved successfully');
    } else {
      const errorText = await profileResponse.text();
      console.log('❌ Profile features failed:', errorText);
    }

    // 3. Test All Notification Features
    console.log('\n3️⃣ Testing All Notification Features...');
    const notificationFeatures = {
      push: true,
      email: false,
      weeklyDigest: true,
      calendarSync: true,
      eventReminders: true,
      friendActivity: true,
      geofenceAlerts: false
    };

    const notificationResponse = await fetch(`${BASE_URL}/api/notifications/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(notificationFeatures)
    });

    if (notificationResponse.ok) {
      console.log('✅ Notification features saved successfully');
    } else {
      const errorText = await notificationResponse.text();
      console.log('❌ Notification features failed:', errorText);
    }

    // 4. Test All Location Features
    console.log('\n4️⃣ Testing All Location Features...');
    const locationFeatures = {
      locationEnabled: true,
      locationPrecision: 'high',
      radius: 35,
      defaultRadius: 30
    };

    const locationResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(locationFeatures)
    });

    if (locationResponse.ok) {
      console.log('✅ Location features saved successfully');
    } else {
      const errorText = await locationResponse.text();
      console.log('❌ Location features failed:', errorText);
    }

    // 5. Test All Privacy & Security Features
    console.log('\n5️⃣ Testing All Privacy & Security Features...');
    const privacyFeatures = {
      profileVisibility: 'private',
      dataSharing: true,
      analyticsEnabled: false,
      twoFactorAuth: true,
      loginNotifications: false
    };

    const privacyResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(privacyFeatures)
    });

    if (privacyResponse.ok) {
      console.log('✅ Privacy & Security features saved successfully');
    } else {
      const errorText = await privacyResponse.text();
      console.log('❌ Privacy & Security features failed:', errorText);
    }

    // 6. Test All Event Preference Features
    console.log('\n6️⃣ Testing All Event Preference Features...');
    const eventPreferenceFeatures = {
      eventTypes: ['music', 'sports', 'food', 'art', 'technology'],
      vibe: ['casual', 'energetic', 'sophisticated'],
      priceRange: ['free', 'low', 'medium', 'high'],
      preferredVibe: 'Casual'
    };

    const eventPreferencesResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventPreferenceFeatures)
    });

    if (eventPreferencesResponse.ok) {
      console.log('✅ Event preference features saved successfully');
    } else {
      const errorText = await eventPreferencesResponse.text();
      console.log('❌ Event preference features failed:', errorText);
    }

    // 7. Verify All Features Work Together
    console.log('\n7️⃣ Verifying All Features Work Together...');
    const userResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ User data retrieved successfully');
      
      // Check Profile Features
      const profile = userData.user;
      console.log('📊 Profile Features:', {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        phonePrivacy: profile.phonePrivacy,
        bio: profile.bio
      });

      // Check Notification Features
      const notifications = profile.notificationSettings;
      console.log('📊 Notification Features:', {
        push: notifications.push,
        email: notifications.email,
        weeklyDigest: notifications.weeklyDigest,
        calendarSync: notifications.calendarSync,
        eventReminders: notifications.eventReminders,
        friendActivity: notifications.friendActivity,
        geofenceAlerts: notifications.geofenceAlerts
      });

      // Check Location Features
      const location = profile.preferences;
      console.log('📊 Location Features:', {
        locationEnabled: location.locationEnabled,
        locationPrecision: location.locationPrecision,
        radius: location.radius,
        defaultRadius: location.defaultRadius
      });

      // Check Privacy Features
      console.log('📊 Privacy Features:', {
        profileVisibility: location.profileVisibility,
        dataSharing: location.dataSharing,
        analyticsEnabled: location.analyticsEnabled,
        twoFactorAuth: location.twoFactorAuth,
        loginNotifications: location.loginNotifications
      });

      // Check Event Preference Features
      console.log('📊 Event Preference Features:', {
        eventTypes: location.eventTypes,
        vibe: location.vibe,
        priceRange: location.priceRange,
        preferredVibe: location.preferredVibe
      });

      // Verify all features are working
      const allFeaturesWorking = 
        profile.name === 'Test User Complete' &&
        profile.phone === '+1234567890' &&
        profile.phonePrivacy === true &&
        notifications.calendarSync === true &&
        location.locationEnabled === true &&
        location.locationPrecision === 'high' &&
        location.profileVisibility === 'private' &&
        location.twoFactorAuth === true &&
        location.eventTypes.includes('technology');

      if (allFeaturesWorking) {
        console.log('✅ All personalization features are working correctly!');
      } else {
        console.log('❌ Some personalization features are not working correctly');
      }
    } else {
      console.log('❌ Failed to get user data');
    }

    console.log('\n🎉 All personalization pathways test completed!');
    console.log('\n📋 Pathways Tested:');
    console.log('✅ Profile Pathway - Edit Profile Screen');
    console.log('✅ Notification Pathway - Notification Settings Screen');
    console.log('✅ Location Pathway - Location Settings Screen');
    console.log('✅ Privacy Pathway - Privacy & Security Screen');
    console.log('✅ Event Preferences Pathway - Settings Screen');
    console.log('✅ Calendar Sync Pathway - Notification Settings Screen');
    console.log('✅ Phone Privacy Pathway - Edit Profile Screen');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAllPersonalizationPathways(); 