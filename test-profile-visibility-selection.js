const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testProfileVisibilitySelection() {
  console.log('🧪 Testing Profile Visibility Selection\n');

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

    // 2. Get current user data to see initial profile visibility
    console.log('\n2️⃣ Getting current user data...');
    const currentUserResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (currentUserResponse.ok) {
      const currentUserData = await currentUserResponse.json();
      console.log('📊 Current profile visibility:', currentUserData.user.preferences.profileVisibility);
    }

    // 3. Test changing profile visibility to 'friends'
    console.log('\n3️⃣ Testing profile visibility change to friends...');
    const profileVisibilityData = {
      profileVisibility: 'friends'
    };

    console.log('📤 Sending profile visibility data:', profileVisibilityData);
    
    const profileVisibilityResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileVisibilityData)
    });

    if (profileVisibilityResponse.ok) {
      const profileVisibilityResponseData = await profileVisibilityResponse.json();
      console.log('✅ Profile visibility change to friends saved successfully');
      console.log('📊 Response profileVisibility:', profileVisibilityResponseData.preferences.profileVisibility);
    } else {
      const errorText = await profileVisibilityResponse.text();
      console.log('❌ Profile visibility change to friends failed:', errorText);
    }

    // 4. Verify the profile visibility was saved correctly
    console.log('\n4️⃣ Verifying profile visibility was saved...');
    const verifyResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('✅ User data retrieved successfully');
      
      const profileVisibility = verifyData.user.preferences.profileVisibility;
      console.log('📊 Saved profile visibility:', profileVisibility);

      if (profileVisibility === 'friends') {
        console.log('✅ Profile visibility change to friends saved correctly!');
      } else {
        console.log('❌ Profile visibility change to friends not saved correctly');
      }
    } else {
      console.log('❌ Failed to verify saved profile visibility');
    }

    // 5. Test changing profile visibility to 'private'
    console.log('\n5️⃣ Testing profile visibility change to private...');
    const newProfileVisibilityData = {
      profileVisibility: 'private'
    };

    console.log('📤 Sending new profile visibility data:', newProfileVisibilityData);
    
    const newProfileVisibilityResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newProfileVisibilityData)
    });

    if (newProfileVisibilityResponse.ok) {
      console.log('✅ Profile visibility change to private saved successfully');
    } else {
      console.log('❌ Profile visibility change to private failed');
    }

    // 6. Verify the new profile visibility was saved correctly
    console.log('\n6️⃣ Verifying new profile visibility was saved...');
    const finalVerifyResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (finalVerifyResponse.ok) {
      const finalVerifyData = await finalVerifyResponse.json();
      console.log('✅ Final user data retrieved successfully');
      
      const finalProfileVisibility = finalVerifyData.user.preferences.profileVisibility;
      console.log('📊 Final saved profile visibility:', finalProfileVisibility);

      if (finalProfileVisibility === 'private') {
        console.log('✅ Profile visibility change to private saved correctly!');
      } else {
        console.log('❌ Profile visibility change to private not saved correctly');
      }
    }

    console.log('\n🎉 Profile visibility selection test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testProfileVisibilitySelection(); 