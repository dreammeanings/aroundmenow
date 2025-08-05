const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testFrontendSaveSimulation() {
  console.log('🧪 Testing Frontend Save Simulation\n');

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

    // 2. Simulate what the frontend does - get current user data
    console.log('\n2️⃣ Simulating frontend - getting current user data...');
    const currentUserResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (currentUserResponse.ok) {
      const currentUserData = await currentUserResponse.json();
      console.log('📊 Current user data retrieved (simulating frontend load)');
      console.log('📊 Privacy settings:', {
        profileVisibility: currentUserData.user.preferences.profileVisibility,
        dataSharing: currentUserData.user.preferences.dataSharing,
        analyticsEnabled: currentUserData.user.preferences.analyticsEnabled,
        twoFactorAuth: currentUserData.user.preferences.twoFactorAuth,
        loginNotifications: currentUserData.user.preferences.loginNotifications
      });
      console.log('📊 Location settings:', {
        locationEnabled: currentUserData.user.preferences.locationEnabled,
        locationPrecision: currentUserData.user.preferences.locationPrecision,
        radius: currentUserData.user.preferences.radius
      });
    }

    // 3. Simulate what the frontend does - save privacy settings
    console.log('\n3️⃣ Simulating frontend - saving privacy settings...');
    const privacyData = {
      profileVisibility: 'public',
      dataSharing: false,
      analyticsEnabled: true,
      twoFactorAuth: false,
      loginNotifications: true
    };

    console.log('📤 Frontend would send this privacy data:', privacyData);
    
    const privacyResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(privacyData)
    });

    if (privacyResponse.ok) {
      console.log('✅ Privacy settings saved (simulating frontend save)');
    } else {
      console.log('❌ Privacy settings failed');
    }

    // 4. Simulate what the frontend does - refresh user data
    console.log('\n4️⃣ Simulating frontend - refreshing user data after save...');
    const refreshResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      console.log('📊 Refreshed user data (simulating frontend refresh)');
      console.log('📊 Updated privacy settings:', {
        profileVisibility: refreshData.user.preferences.profileVisibility,
        dataSharing: refreshData.user.preferences.dataSharing,
        analyticsEnabled: refreshData.user.preferences.analyticsEnabled,
        twoFactorAuth: refreshData.user.preferences.twoFactorAuth,
        loginNotifications: refreshData.user.preferences.loginNotifications
      });
    }

    // 5. Simulate what the frontend does - save location settings
    console.log('\n5️⃣ Simulating frontend - saving location settings...');
    const locationData = {
      locationEnabled: false,
      locationPrecision: 'low',
      radius: 10
    };

    console.log('📤 Frontend would send this location data:', locationData);
    
    const locationResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(locationData)
    });

    if (locationResponse.ok) {
      console.log('✅ Location settings saved (simulating frontend save)');
    } else {
      console.log('❌ Location settings failed');
    }

    // 6. Simulate what the frontend does - refresh user data again
    console.log('\n6️⃣ Simulating frontend - refreshing user data after location save...');
    const finalRefreshResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (finalRefreshResponse.ok) {
      const finalRefreshData = await finalRefreshResponse.json();
      console.log('📊 Final refreshed user data (simulating frontend refresh)');
      console.log('📊 Final privacy settings:', {
        profileVisibility: finalRefreshData.user.preferences.profileVisibility,
        dataSharing: finalRefreshData.user.preferences.dataSharing,
        analyticsEnabled: finalRefreshData.user.preferences.analyticsEnabled,
        twoFactorAuth: finalRefreshData.user.preferences.twoFactorAuth,
        loginNotifications: finalRefreshData.user.preferences.loginNotifications
      });
      console.log('📊 Final location settings:', {
        locationEnabled: finalRefreshData.user.preferences.locationEnabled,
        locationPrecision: finalRefreshData.user.preferences.locationPrecision,
        radius: finalRefreshData.user.preferences.radius
      });

      // Check if the values match what we sent
      const privacyMatches = 
        finalRefreshData.user.preferences.profileVisibility === 'public' &&
        finalRefreshData.user.preferences.dataSharing === false &&
        finalRefreshData.user.preferences.analyticsEnabled === true &&
        finalRefreshData.user.preferences.twoFactorAuth === false &&
        finalRefreshData.user.preferences.loginNotifications === true;

      const locationMatches = 
        finalRefreshData.user.preferences.locationEnabled === false &&
        finalRefreshData.user.preferences.locationPrecision === 'low' &&
        finalRefreshData.user.preferences.radius === 10;

      if (privacyMatches) {
        console.log('✅ Privacy settings correctly saved and retrieved!');
      } else {
        console.log('❌ Privacy settings not correctly saved and retrieved');
      }

      if (locationMatches) {
        console.log('✅ Location settings correctly saved and retrieved!');
      } else {
        console.log('❌ Location settings not correctly saved and retrieved');
      }
    }

    console.log('\n🎉 Frontend save simulation test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFrontendSaveSimulation(); 