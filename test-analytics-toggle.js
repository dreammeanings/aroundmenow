const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testAnalyticsToggle() {
  console.log('🧪 Testing Analytics Toggle\n');

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

    // 2. Get current user data to see initial analytics setting
    console.log('\n2️⃣ Getting current user data...');
    const currentUserResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (currentUserResponse.ok) {
      const currentUserData = await currentUserResponse.json();
      console.log('📊 Current analytics setting:', currentUserData.user.preferences.analyticsEnabled);
    }

    // 3. Test toggling analytics to false
    console.log('\n3️⃣ Testing analytics toggle to false...');
    const analyticsFalseData = {
      analyticsEnabled: false
    };

    console.log('📤 Sending analytics data:', analyticsFalseData);
    
    const analyticsFalseResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(analyticsFalseData)
    });

    if (analyticsFalseResponse.ok) {
      const analyticsFalseResponseData = await analyticsFalseResponse.json();
      console.log('✅ Analytics toggle to false saved successfully');
      console.log('📊 Response analyticsEnabled:', analyticsFalseResponseData.preferences.analyticsEnabled);
    } else {
      const errorText = await analyticsFalseResponse.text();
      console.log('❌ Analytics toggle to false failed:', errorText);
    }

    // 4. Verify the analytics setting was saved correctly
    console.log('\n4️⃣ Verifying analytics setting was saved...');
    const verifyResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('✅ User data retrieved successfully');
      
      const analyticsEnabled = verifyData.user.preferences.analyticsEnabled;
      console.log('📊 Saved analytics setting:', analyticsEnabled);

      if (analyticsEnabled === false) {
        console.log('✅ Analytics toggle to false saved correctly!');
      } else {
        console.log('❌ Analytics toggle to false not saved correctly');
      }
    } else {
      console.log('❌ Failed to verify saved analytics setting');
    }

    // 5. Test toggling analytics to true
    console.log('\n5️⃣ Testing analytics toggle to true...');
    const analyticsTrueData = {
      analyticsEnabled: true
    };

    console.log('📤 Sending analytics data:', analyticsTrueData);
    
    const analyticsTrueResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(analyticsTrueData)
    });

    if (analyticsTrueResponse.ok) {
      console.log('✅ Analytics toggle to true saved successfully');
    } else {
      console.log('❌ Analytics toggle to true failed');
    }

    // 6. Verify the new analytics setting was saved correctly
    console.log('\n6️⃣ Verifying new analytics setting was saved...');
    const finalVerifyResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (finalVerifyResponse.ok) {
      const finalVerifyData = await finalVerifyResponse.json();
      console.log('✅ Final user data retrieved successfully');
      
      const finalAnalyticsEnabled = finalVerifyData.user.preferences.analyticsEnabled;
      console.log('📊 Final saved analytics setting:', finalAnalyticsEnabled);

      if (finalAnalyticsEnabled === true) {
        console.log('✅ Analytics toggle to true saved correctly!');
      } else {
        console.log('❌ Analytics toggle to true not saved correctly');
      }
    }

    console.log('\n🎉 Analytics toggle test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAnalyticsToggle(); 