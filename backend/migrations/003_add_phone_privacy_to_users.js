exports.up = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.boolean('phone_privacy').defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('phone_privacy');
  });
}; 