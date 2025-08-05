exports.up = function(knex) {
  return knex.schema.createTable('venues', (table) => {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Venue info
    table.string('name').notNullable();
    table.text('description');
    table.string('logo_url');
    table.string('cover_image_url');
    
    // Contact info
    table.string('email');
    table.string('phone');
    table.string('website_url');
    
    // Social media
    table.string('facebook_url');
    table.string('instagram_url');
    table.string('twitter_url');
    table.string('linkedin_url');
    
    // Location
    table.string('address').notNullable();
    table.string('city').notNullable();
    table.string('state').notNullable();
    table.string('zip_code').notNullable();
    table.string('country').defaultTo('US');
    table.decimal('latitude', 10, 8).notNullable();
    table.decimal('longitude', 11, 8).notNullable();
    
    // Venue details
    table.integer('capacity');
    table.jsonb('amenities').defaultTo([]);
    table.jsonb('event_types').defaultTo([]);
    table.string('venue_type'); // restaurant, bar, theater, etc.
    
    // Business hours
    table.jsonb('business_hours').defaultTo({});
    
    // Subscription info
    table.string('subscription_tier').defaultTo('Free');
    table.decimal('subscription_price', 10, 2).defaultTo(0);
    table.timestamp('subscription_start_date');
    table.timestamp('subscription_end_date');
    table.string('stripe_customer_id');
    table.string('stripe_subscription_id');
    
    // Verification
    table.boolean('is_verified').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.timestamp('verified_at');
    table.string('verification_document_url');
    
    // Analytics
    table.integer('total_events').defaultTo(0);
    table.integer('total_views').defaultTo(0);
    table.integer('total_saves').defaultTo(0);
    table.integer('total_shares').defaultTo(0);
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('name');
    table.index('city');
    table.index('state');
    table.index('subscription_tier');
    table.index('is_verified');
    table.index('is_active');
    table.index('latitude');
    table.index('longitude');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('venues');
}; 