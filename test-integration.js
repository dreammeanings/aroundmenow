#!/usr/bin/env node

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000/api';

async function testBackendIntegration() {
  console.log('🧪 Testing Around Me Now Backend Integration...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    if (healthResponse.ok) {
      console.log('✅ Health check passed');
    } else {
      console.log('❌ Health check failed');
    }

    // Test 2: Authentication
    console.log('\n2️⃣ Testing authentication...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Authentication successful');
      console.log(`   User: ${loginData.user.name}`);
      console.log(`   Token: ${loginData.token.substring(0, 20)}...`);
      
      const token = loginData.token;

      // Test 3: Events API
      console.log('\n3️⃣ Testing events API...');
      const eventsResponse = await fetch(`${API_BASE_URL}/events`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        console.log(`✅ Events API working - ${eventsData.events.length} events found`);
        
        // Test 4: Venues API
        console.log('\n4️⃣ Testing venues API...');
        const venuesResponse = await fetch(`${API_BASE_URL}/venues`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (venuesResponse.ok) {
          const venuesData = await venuesResponse.json();
          console.log(`✅ Venues API working - ${venuesData.venues.length} venues found`);
        } else {
          console.log('❌ Venues API failed');
        }

        // Test 5: Saved Events API
        console.log('\n5️⃣ Testing saved events API...');
        const savedEventsResponse = await fetch(`${API_BASE_URL}/users/saved-events`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (savedEventsResponse.ok) {
          const savedEventsData = await savedEventsResponse.json();
          console.log(`✅ Saved events API working - ${savedEventsData.events.length} saved events`);
        } else {
          console.log('❌ Saved events API failed');
        }

      } else {
        console.log('❌ Events API failed');
      }

    } else {
      console.log('❌ Authentication failed');
      const errorData = await loginResponse.json();
      console.log(`   Error: ${errorData.error}`);
    }

    console.log('\n🎉 Backend Integration Test Complete!');
    console.log('\n📱 Next Steps:');
    console.log('1. Test the mobile app with these credentials:');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');
    console.log('2. Verify events load in the app');
    console.log('3. Test saving/unsaving events');
    console.log('4. Test map view with real data');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend is running: cd backend && npm run dev');
    console.log('2. Check database connection');
    console.log('3. Verify environment variables');
  }
}

testBackendIntegration(); 