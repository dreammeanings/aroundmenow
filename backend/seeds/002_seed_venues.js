const db = require('../src/config/database');

exports.seed = async function(knex) {
  try {
    console.log('🌱 Seeding venues...');

    // Get the first user to associate venues with
    const user = await knex('users').first();
    if (!user) {
      console.log('No users found. Please run user seeds first.');
      return;
    }

    const venues = [
      {
        id: 'c78eaac2-8446-4310-9950-ce40fd8a6e58',
        user_id: user.id,
        name: 'The Grand Hall',
        description: 'A beautiful event space perfect for weddings, corporate events, and social gatherings.',
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip_code: '94102',
        latitude: 37.7749,
        longitude: -122.4194,
        phone: '(415) 555-0123',
        email: 'info@grandhall.com',
        website_url: 'https://grandhall.com',
        venue_type: 'Event Space',
        subscription_tier: 'Pro',
        facebook_url: 'https://facebook.com/grandhall',
        instagram_url: 'https://instagram.com/grandhall',
        twitter_url: 'https://twitter.com/grandhall',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '2287bb63-b23a-4904-9f96-a006e3e34a5c',
        user_id: user.id,
        name: 'Tech Hub Co-working',
        description: 'Modern co-working space with meeting rooms and event facilities for tech professionals.',
        address: '789 Innovation Blvd',
        city: 'San Francisco',
        state: 'CA',
        zip_code: '94105',
        latitude: 37.7949,
        longitude: -122.3994,
        phone: '(415) 555-0456',
        email: 'hello@techhub.com',
        website_url: 'https://techhub.com',
        venue_type: 'Co-working Space',
        subscription_tier: 'Premium',
        facebook_url: 'https://facebook.com/techhub',
        instagram_url: 'https://instagram.com/techhub',
        twitter_url: 'https://twitter.com/techhub',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'f5a8c123-4567-89ab-cdef-123456789abc',
        user_id: user.id,
        name: 'Downtown Art Gallery',
        description: 'Contemporary art gallery hosting exhibitions, workshops, and cultural events.',
        address: '456 Art District',
        city: 'San Francisco',
        state: 'CA',
        zip_code: '94103',
        latitude: 37.7849,
        longitude: -122.4094,
        phone: '(415) 555-0789',
        email: 'gallery@downtownart.com',
        website_url: 'https://downtownart.com',
        venue_type: 'Gallery',
        subscription_tier: 'Standard',
        facebook_url: 'https://facebook.com/downtownart',
        instagram_url: 'https://instagram.com/downtownart',
        twitter_url: 'https://twitter.com/downtownart',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Insert venues
    await knex('venues').insert(venues);

    console.log('✅ Venues seeded successfully!');
    console.log(`   - Created ${venues.length} venues`);

  } catch (error) {
    console.error('❌ Error seeding venues:', error);
  }
}; 