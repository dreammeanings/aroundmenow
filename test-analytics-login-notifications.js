const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testAnalyticsLoginNotifications() {
  console.log('🧪 Testing Analytics & Login Notifications\n');

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

    // 2. Get current user data to see initial settings
    console.log('\n2️⃣ Getting current user data...');
    const currentUserResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (currentUserResponse.ok) {
      const currentUserData = await currentUserResponse.json();
      console.log('📊 Current settings:', {
        analyticsEnabled: currentUserData.user.preferences.analyticsEnabled,
        loginNotifications: currentUserData.user.preferences.loginNotifications
      });
    }

    // 3. Test saving both analytics and login notifications to false
    console.log('\n3️⃣ Testing save both to false...');
    const bothFalseData = {
      analyticsEnabled: false,
      loginNotifications: false
    };

    console.log('📤 Sending data:', bothFalseData);
    
    const bothFalseResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bothFalseData)
    });

    if (bothFalseResponse.ok) {
      const bothFalseResponseData = await bothFalseResponse.json();
      console.log('✅ Both settings saved successfully');
      console.log('📊 Response:', {
        analyticsEnabled: bothFalseResponseData.preferences.analyticsEnabled,
        loginNotifications: bothFalseResponseData.preferences.loginNotifications
      });
    } else {
      const errorText = await bothFalseResponse.text();
      console.log('❌ Settings failed:', errorText);
    }

    // 4. Verify the settings were saved correctly
    console.log('\n4️⃣ Verifying settings were saved...');
    const verifyResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('✅ User data retrieved successfully');
      
      const analyticsEnabled = verifyData.user.preferences.analyticsEnabled;
      const loginNotifications = verifyData.user.preferences.loginNotifications;
      console.log('📊 Saved settings:', {
        analyticsEnabled,
        loginNotifications
      });

      // Check if the values match what we sent
      const bothFalseMatches = 
        analyticsEnabled === false &&
        loginNotifications === false;

      if (bothFalseMatches) {
        console.log('✅ Both settings saved correctly!');
      } else {
        console.log('❌ Settings not saved correctly');
        console.log('❌ Analytics enabled:', analyticsEnabled, 'expected: false');
        console.log('❌ Login notifications:', loginNotifications, 'expected: false');
      }
    } else {
      console.log('❌ Failed to verify saved settings');
    }

    // 5. Test saving both to true
    console.log('\n5️⃣ Testing save both to true...');
    const bothTrueData = {
      analyticsEnabled: true,
      loginNotifications: true
    };

    console.log('📤 Sending data:', bothTrueData);
    
    const bothTrueResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bothTrueData)
    });

    if (bothTrueResponse.ok) {
      console.log('✅ Both settings saved successfully');
    } else {
      console.log('❌ Settings failed');
    }

    // 6. Verify the new settings were saved correctly
    console.log('\n6️⃣ Verifying new settings were saved...');
    const finalVerifyResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (finalVerifyResponse.ok) {
      const finalVerifyData = await finalVerifyResponse.json();
      console.log('✅ Final user data retrieved successfully');
      
      const finalAnalyticsEnabled = finalVerifyData.user.preferences.analyticsEnabled;
      const finalLoginNotifications = finalVerifyData.user.preferences.loginNotifications;
      console.log('📊 Final saved settings:', {
        analyticsEnabled: finalAnalyticsEnabled,
        loginNotifications: finalLoginNotifications
      });

      // Check if the new values match what we sent
      const bothTrueMatches = 
        finalAnalyticsEnabled === true &&
        finalLoginNotifications === true;

      if (bothTrueMatches) {
        console.log('✅ Both settings change saved correctly!');
      } else {
        console.log('❌ Settings change not saved correctly');
        console.log('❌ Analytics enabled:', finalAnalyticsEnabled, 'expected: true');
        console.log('❌ Login notifications:', finalLoginNotifications, 'expected: true');
      }
    }

    console.log('\n🎉 Analytics & Login Notifications test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAnalyticsLoginNotifications(); 