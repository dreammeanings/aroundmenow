const { v4: uuidv4 } = require('uuid');

exports.seed = async function(knex) {
  // First, create some venues
  const venues = [
    {
      id: uuidv4(),
      name: 'The Grand Hall',
      description: 'A beautiful venue for events and celebrations',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip_code: '94102',
      latitude: 37.7749,
      longitude: -122.4194,
      venue_type: 'event_space',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      name: 'Blue Note Jazz Club',
      description: 'Intimate jazz club with live music',
      address: '456 Music Ave',
      city: 'San Francisco',
      state: 'CA',
      zip_code: '94103',
      latitude: 37.7849,
      longitude: -122.4094,
      venue_type: 'music_venue',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      name: 'Tech Hub Co-working',
      description: 'Modern co-working space for tech professionals',
      address: '789 Innovation Blvd',
      city: 'San Francisco',
      state: 'CA',
      zip_code: '94104',
      latitude: 37.7949,
      longitude: -122.3994,
      venue_type: 'co_working',
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  const venueIds = venues.map(v => v.id);

  await knex('venues').insert(venues);

  // Create sample events
  const events = [
    {
      id: uuidv4(),
      title: 'Live Jazz Night',
      description: 'An evening of smooth jazz with local musicians',
      venue_id: venueIds[1],
      venue_name: 'Blue Note Jazz Club',
      start_date: new Date('2024-12-15T20:00:00Z'),
      end_date: new Date('2024-12-15T23:00:00Z'),
      start_time: '8:00 PM',
      end_time: '11:00 PM',
      price: 25,
      price_range: '$$',
      tags: JSON.stringify(['music', 'jazz', 'live']),
      event_types: JSON.stringify(['music']),
      vibe: JSON.stringify(['casual', 'intimate']),
      latitude: 37.7849,
      longitude: -122.4094,
      trending_score: 85,
      total_views: 150,
      total_saves: 45,
      is_trending: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      title: 'Tech Networking Mixer',
      description: 'Connect with fellow tech professionals over drinks',
      venue_id: venueIds[2],
      venue_name: 'Tech Hub Co-working',
      start_date: new Date('2024-12-16T18:00:00Z'),
      end_date: new Date('2024-12-16T21:00:00Z'),
      start_time: '6:00 PM',
      end_time: '9:00 PM',
      price: 0,
      price_range: 'Free',
      tags: JSON.stringify(['networking', 'tech', 'professional']),
      event_types: JSON.stringify(['networking']),
      vibe: JSON.stringify(['professional', 'casual']),
      latitude: 37.7949,
      longitude: -122.3994,
      trending_score: 92,
      total_views: 200,
      total_saves: 78,
      is_trending: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      title: 'Art Gallery Opening',
      description: 'Exhibition featuring local artists',
      venue_id: venueIds[0],
      venue_name: 'The Grand Hall',
      start_date: new Date('2024-12-17T19:00:00Z'),
      end_date: new Date('2024-12-17T22:00:00Z'),
      start_time: '7:00 PM',
      end_time: '10:00 PM',
      price: 15,
      price_range: '$',
      tags: JSON.stringify(['art', 'culture', 'exhibition']),
      event_types: JSON.stringify(['art']),
      vibe: JSON.stringify(['dressy', 'cultural']),
      latitude: 37.7749,
      longitude: -122.4194,
      trending_score: 78,
      total_views: 120,
      total_saves: 32,
      is_trending: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      title: 'Food Truck Festival',
      description: 'Sample the best food trucks in the city',
      venue_id: venueIds[0],
      venue_name: 'The Grand Hall',
      start_date: new Date('2024-12-18T12:00:00Z'),
      end_date: new Date('2024-12-18T18:00:00Z'),
      start_time: '12:00 PM',
      end_time: '6:00 PM',
      price: 0,
      price_range: 'Free',
      tags: JSON.stringify(['food', 'festival', 'outdoor']),
      event_types: JSON.stringify(['food']),
      vibe: JSON.stringify(['casual', 'family']),
      latitude: 37.7749,
      longitude: -122.4194,
      trending_score: 95,
      total_views: 300,
      total_saves: 120,
      is_trending: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      title: 'Yoga in the Park',
      description: 'Free yoga session in the beautiful city park',
      venue_id: venueIds[0],
      venue_name: 'The Grand Hall',
      start_date: new Date('2024-12-19T09:00:00Z'),
      end_date: new Date('2024-12-19T10:30:00Z'),
      start_time: '9:00 AM',
      end_time: '10:30 AM',
      price: 0,
      price_range: 'Free',
      tags: JSON.stringify(['wellness', 'yoga', 'outdoor']),
      event_types: JSON.stringify(['wellness']),
      vibe: JSON.stringify(['casual', 'outdoors']),
      latitude: 37.7749,
      longitude: -122.4194,
      trending_score: 88,
      total_views: 180,
      total_saves: 65,
      is_trending: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  const eventIds = events.map(e => e.id);

  await knex('events').insert(events);

  // Get the first user to associate saved events with
  const user = await knex('users').first();
  if (!user) {
    console.log('No users found. Please run user seeds first.');
    return;
  }

  // Create some saved events
  const savedEvents = [
    {
      user_id: user.id,
      event_id: eventIds[0],
      saved_at: new Date()
    },
    {
      user_id: user.id,
      event_id: eventIds[1],
      saved_at: new Date()
    }
  ];

  await knex('user_saved_events').insert(savedEvents);

  // Create some analytics events
  const analyticsEvents = [
    {
      user_id: user.id,
      event_type: 'event_view',
      event_id: eventIds[0],
      properties: JSON.stringify({ eventTitle: 'Live Jazz Night' }),
      timestamp: new Date()
    },
    {
      user_id: user.id,
      event_type: 'event_save',
      event_id: eventIds[0],
      properties: JSON.stringify({ eventTitle: 'Live Jazz Night', saved: true }),
      timestamp: new Date()
    }
  ];

  await knex('analytics_events').insert(analyticsEvents);
}; 