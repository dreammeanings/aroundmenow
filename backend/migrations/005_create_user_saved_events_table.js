exports.up = function(knex) {
  return knex.schema.createTable('user_saved_events', (table) => {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Relationships
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('event_id').references('id').inTable('events').onDelete('CASCADE');
    
    // Timestamps
    table.timestamp('saved_at').defaultTo(knex.fn.now());
    
    // Unique constraint to prevent duplicate saves
    table.unique(['user_id', 'event_id']);
    
    // Indexes
    table.index('user_id');
    table.index('event_id');
    table.index('saved_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_saved_events');
}; 