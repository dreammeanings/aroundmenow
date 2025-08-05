exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Basic user info
    table.string('email').unique().notNullable();
    table.string('password_hash');
    table.string('name').notNullable();
    table.string('avatar_url');
    table.string('phone');
    
    // Social login fields
    table.string('google_id').unique();
    table.string('apple_id').unique();
    table.string('facebook_id').unique();
    
    // User preferences
    table.jsonb('preferences').defaultTo({
      defaultRadius: 25,
      eventTypes: [],
      vibe: [],
      priceRange: [],
      preferredVibe: 'Casual'
    });
    
    // Notification settings
    table.jsonb('notification_settings').defaultTo({
      push: true,
      email: false,
      weeklyDigest: true,
      eventReminders: true,
      friendActivity: true,
      geofenceAlerts: true
    });
    
    // Subscription info
    table.string('subscription_tier').defaultTo('Free');
    table.decimal('subscription_price', 10, 2).defaultTo(0);
    table.timestamp('subscription_start_date');
    table.timestamp('subscription_end_date');
    table.string('stripe_customer_id');
    
    // Location info
    table.decimal('latitude', 10, 8);
    table.decimal('longitude', 11, 8);
    table.string('location_name');
    table.string('timezone').defaultTo('America/New_York');
    
    // Account status
    table.boolean('email_verified').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_venue_owner').defaultTo(false);
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('last_login_at');
    table.timestamp('member_since').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('email');
    table.index('google_id');
    table.index('apple_id');
    table.index('facebook_id');
    table.index('subscription_tier');
    table.index('is_active');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
}; 