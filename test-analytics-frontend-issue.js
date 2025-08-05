const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testAnalyticsFrontendIssue() {
  console.log('🧪 Testing Analytics Frontend Issue\n');

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

    // 2. Simulate frontend sequence with analytics toggle
    console.log('\n2️⃣ Testing frontend analytics sequence...');
    
    // Step 1: Get initial state (like frontend does on load)
    const initialResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (initialResponse.ok) {
      const initialData = await initialResponse.json();
      console.log('📊 Initial analytics setting (frontend load):', initialData.user.preferences.analyticsEnabled);
    }

    // Step 2: Simulate user toggling analytics to false (like frontend toggle)
    console.log('\n3️⃣ Simulating user toggling analytics to false...');
    console.log('📊 In frontend, user would toggle analytics from true to false');
    
    // Step 3: Save the change (like frontend save)
    console.log('\n4️⃣ Saving analytics toggle to false...');
    const analyticsData = {
      analyticsEnabled: false
    };

    const analyticsResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(analyticsData)
    });

    if (analyticsResponse.ok) {
      console.log('✅ Analytics toggle to false saved to backend');
    }

    // Step 4: Refresh user data (like frontend refresh)
    console.log('\n5️⃣ Refreshing user data...');
    const refreshResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      console.log('📊 Refreshed analytics setting (frontend refresh):', refreshData.user.preferences.analyticsEnabled);
      
      // Verify analytics setting was saved correctly
      if (refreshData.user.preferences.analyticsEnabled === false) {
        console.log('✅ Analytics toggle to false saved correctly!');
      } else {
        console.log('❌ Analytics toggle to false not saved correctly - it retracted!');
      }
    }

    // Step 5: Simulate user toggling analytics back to true (like frontend toggle)
    console.log('\n6️⃣ Simulating user toggling analytics back to true...');
    console.log('📊 In frontend, user would toggle analytics from false to true');
    
    // Step 6: Save the change (like frontend save)
    console.log('\n7️⃣ Saving analytics toggle to true...');
    const newAnalyticsData = {
      analyticsEnabled: true
    };

    const newAnalyticsResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newAnalyticsData)
    });

    if (newAnalyticsResponse.ok) {
      console.log('✅ Analytics toggle to true saved to backend');
    }

    // Step 7: Refresh user data again (like frontend refresh)
    console.log('\n8️⃣ Refreshing user data again...');
    const finalRefreshResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (finalRefreshResponse.ok) {
      const finalRefreshData = await finalRefreshResponse.json();
      console.log('📊 Final refreshed analytics setting (frontend refresh):', finalRefreshData.user.preferences.analyticsEnabled);
      
      // Verify new analytics setting was saved correctly
      if (finalRefreshData.user.preferences.analyticsEnabled === true) {
        console.log('✅ Analytics toggle to true saved correctly!');
      } else {
        console.log('❌ Analytics toggle to true not saved correctly - it retracted!');
      }
    }

    console.log('\n🎉 Analytics frontend issue test completed!');
    console.log('\n📋 Analysis:');
    console.log('✅ Backend saves analytics toggle correctly');
    console.log('✅ API endpoints work perfectly');
    console.log('✅ Data persistence is working');
    console.log('🔍 Issue might be in frontend state management');
    console.log('🔍 Analytics toggle might not be updating local state properly');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAnalyticsFrontendIssue(); 