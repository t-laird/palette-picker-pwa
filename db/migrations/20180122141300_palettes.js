exports.up = function(knex, Promise) {
  return knex.schema.createTable('palettes', table => {
    table.increments('palette_id').primary();
    table.text('palette_name');
    table.text('color1');
    table.text('color2');
    table.text('color3');
    table.text('color4');
    table.text('color5');
    table.integer('project_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('palettes');
};