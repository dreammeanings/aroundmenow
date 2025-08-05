exports.up = function(knex) {
  return knex.schema.table('venues', (table) => {
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.index('user_id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('venues', (table) => {
    table.dropColumn('user_id');
  });
}; 