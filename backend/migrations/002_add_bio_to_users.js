exports.up = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.text('bio');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('bio');
  });
}; 