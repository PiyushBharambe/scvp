exports.up = function(knex) {
  return knex.schema.table('suppliers', function(table) {
    table.integer('performance_score').nullable();
    table.string('performance_grade', 2).nullable();
    table.timestamp('last_score_update').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('suppliers', function(table) {
    table.dropColumn('performance_score');
    table.dropColumn('performance_grade');
    table.dropColumn('last_score_update');
  });
};