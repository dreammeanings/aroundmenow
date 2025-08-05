exports.up = function(knex) {
  return knex.schema.createTable('analytics_events', (table) => {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Event tracking
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('event_type').notNullable();
    table.uuid('event_id'); // For event-specific analytics
    table.jsonb('properties').defaultTo({});
    
    // Timestamps
    table.timestamp('timestamp').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('user_id');
    table.index('event_type');
    table.index('event_id');
    table.index('timestamp');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('analytics_events');
}; 