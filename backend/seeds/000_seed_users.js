const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  try {
    console.log('🌱 Seeding users...');

    // Hash passwords
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash('password123', saltRounds);

    const users = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        password_hash: passwordHash,
        name: 'Test User',
        phone: '(555) 123-4567',
        email_verified: true,
        is_active: true,
        member_since: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        preferences: JSON.stringify({
          defaultRadius: 25,
          eventTypes: ['music', 'networking', 'food'],
          vibe: ['casual', 'professional'],
          priceRange: ['Free', '$'],
          preferredVibe: 'Casual'
        }),
        notification_settings: JSON.stringify({
          push: true,
          email: false,
          weeklyDigest: true,
          eventReminders: true,
          friendActivity: true,
          geofenceAlerts: true
        }),
        subscription_tier: 'Free',
        subscription_price: 0,
        latitude: 37.7749,
        longitude: -122.4194,
        location_name: 'San Francisco, CA',
        timezone: 'America/Los_Angeles'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'venue@example.com',
        password_hash: passwordHash,
        name: 'Venue Owner',
        phone: '(555) 987-6543',
        email_verified: true,
        is_active: true,
        is_venue_owner: true,
        member_since: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        preferences: JSON.stringify({
          defaultRadius: 50,
          eventTypes: ['music', 'food', 'art'],
          vibe: ['casual', 'elegant'],
          priceRange: ['Free', '$', '$$'],
          preferredVibe: 'Casual'
        }),
        notification_settings: JSON.stringify({
          push: true,
          email: true,
          weeklyDigest: true,
          eventReminders: true,
          friendActivity: true,
          geofenceAlerts: true
        }),
        subscription_tier: 'Pro',
        subscription_price: 49,
        latitude: 37.7849,
        longitude: -122.4094,
        location_name: 'San Francisco, CA',
        timezone: 'America/Los_Angeles'
      }
    ];

    // Insert users
    await knex('users').insert(users);

    console.log('✅ Users seeded successfully!');
    console.log(`   - Created ${users.length} users`);
    console.log('   - Test user: test@example.com / password123');
    console.log('   - Venue owner: venue@example.com / password123');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
}; 