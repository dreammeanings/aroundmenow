const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testPrivacyLocationSaveIssue() {
  console.log('🧪 Testing Privacy & Location Settings Save Issue\n');

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

    // 2. Get current user data to see what's already saved
    console.log('\n2️⃣ Getting current user data...');
    const currentUserResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (currentUserResponse.ok) {
      const currentUserData = await currentUserResponse.json();
      console.log('📊 Current Privacy Settings:', {
        profileVisibility: currentUserData.user.preferences.profileVisibility,
        dataSharing: currentUserData.user.preferences.dataSharing,
        analyticsEnabled: currentUserData.user.preferences.analyticsEnabled,
        twoFactorAuth: currentUserData.user.preferences.twoFactorAuth,
        loginNotifications: currentUserData.user.preferences.loginNotifications
      });
      console.log('📊 Current Location Settings:', {
        locationEnabled: currentUserData.user.preferences.locationEnabled,
        locationPrecision: currentUserData.user.preferences.locationPrecision,
        radius: currentUserData.user.preferences.radius
      });
    }

    // 3. Test Privacy Settings Save
    console.log('\n3️⃣ Testing Privacy Settings Save...');
    const privacyData = {
      profileVisibility: 'private',
      dataSharing: true,
      analyticsEnabled: false,
      twoFactorAuth: true,
      loginNotifications: false
    };

    console.log('📤 Sending privacy data:', privacyData);
    
    const privacyResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(privacyData)
    });

    if (privacyResponse.ok) {
      const privacyResponseData = await privacyResponse.json();
      console.log('✅ Privacy settings saved successfully');
      console.log('📊 Response:', privacyResponseData);
    } else {
      const errorText = await privacyResponse.text();
      console.log('❌ Privacy settings failed:', errorText);
    }

    // 4. Test Location Settings Save
    console.log('\n4️⃣ Testing Location Settings Save...');
    const locationData = {
      locationEnabled: true,
      locationPrecision: 'high',
      radius: 35
    };

    console.log('📤 Sending location data:', locationData);
    
    const locationResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(locationData)
    });

    if (locationResponse.ok) {
      const locationResponseData = await locationResponse.json();
      console.log('✅ Location settings saved successfully');
      console.log('📊 Response:', locationResponseData);
    } else {
      const errorText = await locationResponse.text();
      console.log('❌ Location settings failed:', errorText);
    }

    // 5. Verify the changes were actually saved
    console.log('\n5️⃣ Verifying saved changes...');
    const verifyResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('✅ User data retrieved successfully');
      
      const preferences = verifyData.user.preferences;
      console.log('📊 Updated Privacy Settings:', {
        profileVisibility: preferences.profileVisibility,
        dataSharing: preferences.dataSharing,
        analyticsEnabled: preferences.analyticsEnabled,
        twoFactorAuth: preferences.twoFactorAuth,
        loginNotifications: preferences.loginNotifications
      });
      console.log('📊 Updated Location Settings:', {
        locationEnabled: preferences.locationEnabled,
        locationPrecision: preferences.locationPrecision,
        radius: preferences.radius
      });

      // Check if the values match what we sent
      const privacyMatches = 
        preferences.profileVisibility === 'private' &&
        preferences.dataSharing === true &&
        preferences.analyticsEnabled === false &&
        preferences.twoFactorAuth === true &&
        preferences.loginNotifications === false;

      const locationMatches = 
        preferences.locationEnabled === true &&
        preferences.locationPrecision === 'high' &&
        preferences.radius === 35;

      if (privacyMatches) {
        console.log('✅ Privacy settings saved correctly!');
      } else {
        console.log('❌ Privacy settings not saved correctly');
      }

      if (locationMatches) {
        console.log('✅ Location settings saved correctly!');
      } else {
        console.log('❌ Location settings not saved correctly');
      }
    } else {
      console.log('❌ Failed to verify saved changes');
    }

    console.log('\n🎉 Privacy & Location save issue test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPrivacyLocationSaveIssue(); 