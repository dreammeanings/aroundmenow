const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testBioFunctionality() {
  console.log('🧪 Testing Bio Functionality\n');

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

    // 2. Test Bio Update
    console.log('\n2️⃣ Testing Bio Update...');
    const bioUpdateResponse = await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test User',
        bio: 'This is my test bio! I love going to events and meeting new people.'
      })
    });

    if (!bioUpdateResponse.ok) {
      const errorText = await bioUpdateResponse.text();
      console.log('❌ Bio update failed:', errorText);
    } else {
      console.log('✅ Bio update successful');
    }

    // 3. Verify Bio was saved
    console.log('\n3️⃣ Verifying Bio was saved...');
    const userResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ User data retrieved successfully');
      console.log('📊 Bio field:', userData.user.bio);
      console.log('📊 Full user data:', JSON.stringify(userData, null, 2));
    } else {
      console.log('❌ Failed to get user data');
    }

    console.log('\n🎉 Bio functionality test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBioFunctionality(); 