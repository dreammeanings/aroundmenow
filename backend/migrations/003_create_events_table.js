exports.up = function(knex) {
  return knex.schema.createTable('events', (table) => {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Event info
    table.string('title').notNullable();
    table.text('description');
    table.jsonb('images').defaultTo([]);
    table.string('cover_image_url');
    
    // Venue relationship
    table.uuid('venue_id').references('id').inTable('venues').onDelete('CASCADE');
    table.string('venue_name').notNullable();
    
    // Event details
    table.timestamp('start_date').notNullable();
    table.timestamp('end_date');
    table.string('start_time').notNullable();
    table.string('end_time');
    table.string('timezone').defaultTo('America/New_York');
    
    // Pricing
    table.decimal('price', 10, 2).defaultTo(0);
    table.string('price_range').defaultTo('Free'); // Free, $, $$, $$$
    table.string('currency').defaultTo('USD');
    table.string('ticket_url');
    
    // Event categorization
    table.jsonb('tags').defaultTo([]);
    table.jsonb('event_types').defaultTo([]);
    table.jsonb('vibe').defaultTo([]);
    
    // Location
    table.string('address');
    table.string('city');
    table.string('state');
    table.string('zip_code');
    table.decimal('latitude', 10, 8);
    table.decimal('longitude', 11, 8);
    
    // Event features
    table.boolean('is_featured').defaultTo(false);
    table.boolean('is_trending').defaultTo(false);
    table.boolean('is_local_curated').defaultTo(false);
    table.boolean('is_weekend_preview').defaultTo(false);
    table.integer('trending_score').defaultTo(0);
    
    // Capacity and attendance
    table.integer('capacity');
    table.integer('current_attendees').defaultTo(0);
    table.boolean('is_sold_out').defaultTo(false);
    
    // Social features
    table.jsonb('friends_attending').defaultTo([]);
    table.integer('total_saves').defaultTo(0);
    table.integer('total_shares').defaultTo(0);
    table.integer('total_views').defaultTo(0);
    
    // Status
    table.string('status').defaultTo('active'); // active, cancelled, sold_out, draft
    table.boolean('is_active').defaultTo(true);
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('published_at');
    
    // Indexes
    table.index('venue_id');
    table.index('start_date');
    table.index('end_date');
    table.index('price_range');
    table.index('status');
    table.index('is_active');
    table.index('is_featured');
    table.index('is_trending');
    table.index('city');
    table.index('state');
    table.index('latitude');
    table.index('longitude');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('events');
}; 