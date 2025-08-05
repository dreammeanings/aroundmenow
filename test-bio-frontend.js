const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testBioFrontend() {
  console.log('🧪 Testing Bio Frontend Functionality\n');

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

    // 2. Test Bio Update with Frontend-like Data
    console.log('\n2️⃣ Testing Bio Update (Frontend Format)...');
    const bioUpdateResponse = await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test User',
        phone: '+1234567890',
        bio: 'This is a new bio from the frontend! Testing bio persistence.'
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
      console.log('📊 Name field:', userData.user.name);
      console.log('📊 Phone field:', userData.user.phone);
    } else {
      console.log('❌ Failed to get user data');
    }

    console.log('\n🎉 Bio frontend functionality test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBioFrontend(); 