
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('palettes', table => {
    table.foreign('project_id').references('projects.project_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('palettes', table => {
    table.dropForeign('project_id', 'projects.project_id');
  });
};