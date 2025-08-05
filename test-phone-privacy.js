const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testPhonePrivacy() {
  console.log('🧪 Testing Phone Privacy Functionality\n');

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

    // 2. Test Phone Privacy Update
    console.log('\n2️⃣ Testing Phone Privacy Update...');
    const privacyUpdateResponse = await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test User',
        phone: '+1234567890',
        bio: 'Testing phone privacy feature',
        phonePrivacy: true
      })
    });

    if (!privacyUpdateResponse.ok) {
      const errorText = await privacyUpdateResponse.text();
      console.log('❌ Phone privacy update failed:', errorText);
    } else {
      console.log('✅ Phone privacy update successful');
    }

    // 3. Verify Phone Privacy was saved
    console.log('\n3️⃣ Verifying Phone Privacy was saved...');
    const userResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ User data retrieved successfully');
      console.log('📊 Phone Privacy:', userData.user.phonePrivacy);
      console.log('📊 Phone Number:', userData.user.phone);
      console.log('📊 Name:', userData.user.name);
      console.log('📊 Bio:', userData.user.bio);
    } else {
      console.log('❌ Failed to get user data');
    }

    console.log('\n🎉 Phone privacy functionality test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPhonePrivacy(); 