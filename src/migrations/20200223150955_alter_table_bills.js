exports.up = function(knex, Promise) {
    return  knex.schema.alterTable('bills', function(table) {
        table.string('renew_automatic',1).defaultTo(0);
      });
};

exports.down = function(knex, Promise) {
    
    return  knex.schema.table('bills', function (table) {
        table.dropColumn('renew_automatic');
    });
};