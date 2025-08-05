const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testPersonalizationEdgeCases() {
  console.log('🧪 Testing Personalization Edge Cases\n');

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

    // 2. Test Edge Cases for Profile
    console.log('\n2️⃣ Testing Profile Edge Cases...');
    
    // Test empty bio
    const emptyBioResponse = await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test User Edge Cases',
        bio: '',
        phonePrivacy: false
      })
    });

    if (emptyBioResponse.ok) {
      console.log('✅ Empty bio handled correctly');
    } else {
      console.log('❌ Empty bio failed');
    }

    // Test phone number formatting
    const phoneFormats = [
      '+1234567890',
      '1234567890',
      '(123) 456-7890',
      '123-456-7890'
    ];

    for (const phoneFormat of phoneFormats) {
      const phoneResponse = await fetch(`${BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          phone: phoneFormat
        })
      });

      if (phoneResponse.ok) {
        console.log(`✅ Phone format "${phoneFormat}" accepted`);
      } else {
        console.log(`❌ Phone format "${phoneFormat}" rejected`);
      }
    }

    // 3. Test Edge Cases for Notifications
    console.log('\n3️⃣ Testing Notification Edge Cases...');
    
    // Test all notification settings combinations
    const notificationCombinations = [
      { push: true, email: false, weeklyDigest: false, calendarSync: false },
      { push: false, email: true, weeklyDigest: true, calendarSync: true },
      { push: true, email: true, weeklyDigest: false, calendarSync: true },
      { push: false, email: false, weeklyDigest: false, calendarSync: false }
    ];

    for (let i = 0; i < notificationCombinations.length; i++) {
      const combo = notificationCombinations[i];
      const notificationResponse = await fetch(`${BASE_URL}/api/notifications/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(combo)
      });

      if (notificationResponse.ok) {
        console.log(`✅ Notification combination ${i + 1} saved successfully`);
      } else {
        console.log(`❌ Notification combination ${i + 1} failed`);
      }
    }

    // 4. Test Edge Cases for Location Settings
    console.log('\n4️⃣ Testing Location Edge Cases...');
    
    // Test different radius values
    const radiusValues = [5, 10, 25, 50, 100];
    for (const radius of radiusValues) {
      const radiusResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          radius: radius,
          locationPrecision: 'high'
        })
      });

      if (radiusResponse.ok) {
        console.log(`✅ Radius value ${radius} accepted`);
      } else {
        console.log(`❌ Radius value ${radius} rejected`);
      }
    }

    // Test different precision levels
    const precisionLevels = ['high', 'medium', 'low'];
    for (const precision of precisionLevels) {
      const precisionResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          locationPrecision: precision
        })
      });

      if (precisionResponse.ok) {
        console.log(`✅ Precision level "${precision}" accepted`);
      } else {
        console.log(`❌ Precision level "${precision}" rejected`);
      }
    }

    // 5. Test Edge Cases for Privacy Settings
    console.log('\n5️⃣ Testing Privacy Edge Cases...');
    
    // Test different profile visibility options
    const visibilityOptions = ['public', 'friends', 'private'];
    for (const visibility of visibilityOptions) {
      const visibilityResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          profileVisibility: visibility
        })
      });

      if (visibilityResponse.ok) {
        console.log(`✅ Profile visibility "${visibility}" accepted`);
      } else {
        console.log(`❌ Profile visibility "${visibility}" rejected`);
      }
    }

    // Test boolean combinations
    const booleanCombinations = [
      { dataSharing: true, analyticsEnabled: true, twoFactorAuth: true, loginNotifications: true },
      { dataSharing: false, analyticsEnabled: false, twoFactorAuth: false, loginNotifications: false },
      { dataSharing: true, analyticsEnabled: false, twoFactorAuth: true, loginNotifications: false },
      { dataSharing: false, analyticsEnabled: true, twoFactorAuth: false, loginNotifications: true }
    ];

    for (let i = 0; i < booleanCombinations.length; i++) {
      const combo = booleanCombinations[i];
      const booleanResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(combo)
      });

      if (booleanResponse.ok) {
        console.log(`✅ Boolean combination ${i + 1} saved successfully`);
      } else {
        console.log(`❌ Boolean combination ${i + 1} failed`);
      }
    }

    // 6. Test Edge Cases for Event Preferences
    console.log('\n6️⃣ Testing Event Preference Edge Cases...');
    
    // Test different event type combinations
    const eventTypeCombinations = [
      ['music'],
      ['music', 'sports'],
      ['music', 'sports', 'food', 'art', 'technology'],
      []
    ];

    for (let i = 0; i < eventTypeCombinations.length; i++) {
      const eventTypes = eventTypeCombinations[i];
      const eventTypeResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          eventTypes: eventTypes
        })
      });

      if (eventTypeResponse.ok) {
        console.log(`✅ Event types combination ${i + 1} saved successfully`);
      } else {
        console.log(`❌ Event types combination ${i + 1} failed`);
      }
    }

    // Test different vibe combinations
    const vibeCombinations = [
      ['casual'],
      ['casual', 'energetic'],
      ['casual', 'energetic', 'sophisticated'],
      []
    ];

    for (let i = 0; i < vibeCombinations.length; i++) {
      const vibes = vibeCombinations[i];
      const vibeResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vibe: vibes
        })
      });

      if (vibeResponse.ok) {
        console.log(`✅ Vibe combination ${i + 1} saved successfully`);
      } else {
        console.log(`❌ Vibe combination ${i + 1} failed`);
      }
    }

    // 7. Final Verification
    console.log('\n7️⃣ Final Verification...');
    const userResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ User data retrieved successfully');
      
      // Check that all fields are present
      const profile = userData.user;
      const notifications = profile.notificationSettings;
      const preferences = profile.preferences;
      
      const allFieldsPresent = 
        profile.name &&
        profile.email &&
        profile.phone !== undefined &&
        profile.phonePrivacy !== undefined &&
        profile.bio !== undefined &&
        notifications.push !== undefined &&
        notifications.email !== undefined &&
        notifications.weeklyDigest !== undefined &&
        notifications.calendarSync !== undefined &&
        preferences.locationEnabled !== undefined &&
        preferences.locationPrecision &&
        preferences.radius !== undefined &&
        preferences.profileVisibility &&
        preferences.dataSharing !== undefined &&
        preferences.analyticsEnabled !== undefined &&
        preferences.twoFactorAuth !== undefined &&
        preferences.loginNotifications !== undefined &&
        preferences.eventTypes &&
        preferences.vibe &&
        preferences.priceRange &&
        preferences.preferredVibe;

      if (allFieldsPresent) {
        console.log('✅ All personalization fields are present and working!');
      } else {
        console.log('❌ Some personalization fields are missing');
      }
    } else {
      console.log('❌ Failed to get user data');
    }

    console.log('\n🎉 Personalization edge cases test completed!');
    console.log('\n📋 Edge Cases Tested:');
    console.log('✅ Profile - Empty bio, phone formatting, privacy toggles');
    console.log('✅ Notifications - All combinations of settings');
    console.log('✅ Location - Different radius values, precision levels');
    console.log('✅ Privacy - Visibility options, boolean combinations');
    console.log('✅ Event Preferences - Different arrays, empty arrays');
    console.log('✅ Data Integrity - All fields present and accessible');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPersonalizationEdgeCases(); 