const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testPhoneFieldFix() {
  console.log('🧪 Testing Phone Field Fix\n');

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

    // 2. Test Profile Update with Phone
    console.log('\n2️⃣ Testing Profile Update with Phone...');
    const profileResponse = await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test User Updated',
        phone: '+1234567890',
        phonePrivacy: true,
        bio: 'Testing phone field fix'
      })
    });

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log('✅ Profile updated successfully');
      console.log('📊 Response:', profileData);
    } else {
      const errorText = await profileResponse.text();
      console.log('❌ Profile update failed:', errorText);
    }

    // 3. Verify Phone Field in User Data
    console.log('\n3️⃣ Verifying Phone Field in User Data...');
    const userResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ User data retrieved successfully');
      console.log('📊 Profile Settings:', {
        name: userData.user.name,
        email: userData.user.email,
        phone: userData.user.phone,
        phonePrivacy: userData.user.phonePrivacy,
        bio: userData.user.bio
      });
      
      if (userData.user.phone) {
        console.log('✅ Phone field is now being returned correctly!');
      } else {
        console.log('❌ Phone field is still missing');
      }
    } else {
      console.log('❌ Failed to get user data');
    }

    console.log('\n🎉 Phone field fix test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPhoneFieldFix(); 