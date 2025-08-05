exports.up = function(knex) {
  return knex.schema.createTable('calendar_syncs', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE');
    table.timestamp('synced_at').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Ensure one sync per user per event
    table.unique(['user_id', 'event_id']);
    
    // Indexes for performance
    table.index(['user_id']);
    table.index(['event_id']);
    table.index(['synced_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('calendar_syncs');
}; 