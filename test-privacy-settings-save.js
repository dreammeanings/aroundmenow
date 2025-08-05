const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testPrivacySettingsSave() {
  console.log('🧪 Testing Privacy Settings Save\n');

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

    // 2. Get current user data to see initial privacy settings
    console.log('\n2️⃣ Getting current user data...');
    const currentUserResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (currentUserResponse.ok) {
      const currentUserData = await currentUserResponse.json();
      console.log('📊 Current privacy settings:', {
        profileVisibility: currentUserData.user.preferences.profileVisibility,
        dataSharing: currentUserData.user.preferences.dataSharing,
        analyticsEnabled: currentUserData.user.preferences.analyticsEnabled,
        twoFactorAuth: currentUserData.user.preferences.twoFactorAuth,
        loginNotifications: currentUserData.user.preferences.loginNotifications
      });
    }

    // 3. Test saving specific privacy settings
    console.log('\n3️⃣ Testing privacy settings save...');
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
      console.log('📊 Response:', privacyResponseData.preferences);
    } else {
      const errorText = await privacyResponse.text();
      console.log('❌ Privacy settings failed:', errorText);
    }

    // 4. Verify the privacy settings were saved correctly
    console.log('\n4️⃣ Verifying privacy settings were saved...');
    const verifyResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('✅ User data retrieved successfully');
      
      const preferences = verifyData.user.preferences;
      console.log('📊 Saved privacy settings:', {
        profileVisibility: preferences.profileVisibility,
        dataSharing: preferences.dataSharing,
        analyticsEnabled: preferences.analyticsEnabled,
        twoFactorAuth: preferences.twoFactorAuth,
        loginNotifications: preferences.loginNotifications
      });

      // Check if the values match what we sent
      const privacyMatches = 
        preferences.profileVisibility === 'private' &&
        preferences.dataSharing === true &&
        preferences.analyticsEnabled === false &&
        preferences.twoFactorAuth === true &&
        preferences.loginNotifications === false;

      if (privacyMatches) {
        console.log('✅ Privacy settings saved correctly!');
      } else {
        console.log('❌ Privacy settings not saved correctly');
        console.log('❌ Profile visibility:', preferences.profileVisibility, 'expected: private');
        console.log('❌ Data sharing:', preferences.dataSharing, 'expected: true');
        console.log('❌ Analytics enabled:', preferences.analyticsEnabled, 'expected: false');
        console.log('❌ Two factor auth:', preferences.twoFactorAuth, 'expected: true');
        console.log('❌ Login notifications:', preferences.loginNotifications, 'expected: false');
      }
    } else {
      console.log('❌ Failed to verify saved privacy settings');
    }

    // 5. Test changing privacy settings to different values
    console.log('\n5️⃣ Testing privacy settings change...');
    const newPrivacyData = {
      profileVisibility: 'public',
      dataSharing: false,
      analyticsEnabled: true,
      twoFactorAuth: false,
      loginNotifications: true
    };

    console.log('📤 Sending new privacy data:', newPrivacyData);
    
    const newPrivacyResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newPrivacyData)
    });

    if (newPrivacyResponse.ok) {
      console.log('✅ New privacy settings saved successfully');
    } else {
      console.log('❌ New privacy settings failed');
    }

    // 6. Verify the new privacy settings were saved correctly
    console.log('\n6️⃣ Verifying new privacy settings were saved...');
    const finalVerifyResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (finalVerifyResponse.ok) {
      const finalVerifyData = await finalVerifyResponse.json();
      console.log('✅ Final user data retrieved successfully');
      
      const finalPreferences = finalVerifyData.user.preferences;
      console.log('📊 Final saved privacy settings:', {
        profileVisibility: finalPreferences.profileVisibility,
        dataSharing: finalPreferences.dataSharing,
        analyticsEnabled: finalPreferences.analyticsEnabled,
        twoFactorAuth: finalPreferences.twoFactorAuth,
        loginNotifications: finalPreferences.loginNotifications
      });

      // Check if the new values match what we sent
      const newPrivacyMatches = 
        finalPreferences.profileVisibility === 'public' &&
        finalPreferences.dataSharing === false &&
        finalPreferences.analyticsEnabled === true &&
        finalPreferences.twoFactorAuth === false &&
        finalPreferences.loginNotifications === true;

      if (newPrivacyMatches) {
        console.log('✅ Privacy settings change saved correctly!');
      } else {
        console.log('❌ Privacy settings change not saved correctly');
        console.log('❌ Profile visibility:', finalPreferences.profileVisibility, 'expected: public');
        console.log('❌ Data sharing:', finalPreferences.dataSharing, 'expected: false');
        console.log('❌ Analytics enabled:', finalPreferences.analyticsEnabled, 'expected: true');
        console.log('❌ Two factor auth:', finalPreferences.twoFactorAuth, 'expected: false');
        console.log('❌ Login notifications:', finalPreferences.loginNotifications, 'expected: true');
      }
    }

    console.log('\n🎉 Privacy settings save test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPrivacySettingsSave(); 