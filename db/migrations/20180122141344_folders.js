exports.up = function(knex, Promise) {
  return knex.schema.createTable('projects', table => {
    table.increments('project_id').primary();
    table.text('project_name');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('projects');
};