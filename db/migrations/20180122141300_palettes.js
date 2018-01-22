exports.up = function(knex, Promise) {
  return knex.schema.createTable('palettes', table => {
    table.increments('palette_id').primary();
    table.text('palette_name');
    table.integer('folder_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('folders');
};