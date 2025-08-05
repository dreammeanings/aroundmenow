exports.up = function(knex) {
  return knex.schema.createTable('rsvps', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE');
    table.enum('status', ['going', 'maybe', 'not_going']).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Ensure one RSVP per user per event
    table.unique(['user_id', 'event_id']);
    
    // Indexes for performance
    table.index(['user_id']);
    table.index(['event_id']);
    table.index(['status']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('rsvps');
}; 