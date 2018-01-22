exports.up = function(knex, Promise) {
  return knex.schema.createTable('folders', table => {
    table.increments('folder_id').primary();
    table.text('folder_name');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('folders');
};