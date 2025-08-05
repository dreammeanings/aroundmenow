const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testRadiusSaveFix() {
  console.log('🧪 Testing Radius Save Fix\n');

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

    // 2. Get current user data to see initial radius
    console.log('\n2️⃣ Getting current user data...');
    const currentUserResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (currentUserResponse.ok) {
      const currentUserData = await currentUserResponse.json();
      console.log('📊 Current radius:', currentUserData.user.preferences.radius);
      console.log('📊 Current location settings:', {
        locationEnabled: currentUserData.user.preferences.locationEnabled,
        locationPrecision: currentUserData.user.preferences.locationPrecision,
        radius: currentUserData.user.preferences.radius
      });
    }

    // 3. Test saving a specific radius value
    console.log('\n3️⃣ Testing radius save...');
    const testRadius = 75; // Set a specific radius value
    const locationData = {
      locationEnabled: true,
      locationPrecision: 'high',
      radius: testRadius
    };

    console.log('📤 Sending location data with radius:', testRadius);
    
    const locationResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(locationData)
    });

    if (locationResponse.ok) {
      const locationResponseData = await locationResponse.json();
      console.log('✅ Location settings saved successfully');
      console.log('📊 Response radius:', locationResponseData.preferences.radius);
    } else {
      const errorText = await locationResponse.text();
      console.log('❌ Location settings failed:', errorText);
    }

    // 4. Verify the radius was saved correctly
    console.log('\n4️⃣ Verifying radius was saved...');
    const verifyResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('✅ User data retrieved successfully');
      
      const savedRadius = verifyData.user.preferences.radius;
      console.log('📊 Saved radius:', savedRadius);
      console.log('📊 Expected radius:', testRadius);
      console.log('📊 Radius matches:', savedRadius === testRadius);

      if (savedRadius === testRadius) {
        console.log('✅ Radius saved correctly!');
      } else {
        console.log('❌ Radius not saved correctly - it retracted!');
      }
    } else {
      console.log('❌ Failed to verify saved radius');
    }

    // 5. Test changing radius to a different value
    console.log('\n5️⃣ Testing radius change...');
    const newRadius = 45; // Change to a different value
    const newLocationData = {
      locationEnabled: true,
      locationPrecision: 'medium',
      radius: newRadius
    };

    console.log('📤 Sending new location data with radius:', newRadius);
    
    const newLocationResponse = await fetch(`${BASE_URL}/api/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newLocationData)
    });

    if (newLocationResponse.ok) {
      console.log('✅ New location settings saved successfully');
    } else {
      console.log('❌ New location settings failed');
    }

    // 6. Verify the new radius was saved correctly
    console.log('\n6️⃣ Verifying new radius was saved...');
    const finalVerifyResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (finalVerifyResponse.ok) {
      const finalVerifyData = await finalVerifyResponse.json();
      console.log('✅ Final user data retrieved successfully');
      
      const finalSavedRadius = finalVerifyData.user.preferences.radius;
      console.log('📊 Final saved radius:', finalSavedRadius);
      console.log('📊 Expected radius:', newRadius);
      console.log('📊 Radius matches:', finalSavedRadius === newRadius);

      if (finalSavedRadius === newRadius) {
        console.log('✅ Radius change saved correctly!');
      } else {
        console.log('❌ Radius change not saved correctly - it retracted!');
      }
    }

    console.log('\n🎉 Radius save fix test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRadiusSaveFix(); 