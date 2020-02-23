exports.up = function(knex, Promise) {
    return  knex.schema.alterTable('accounts', function(table) {
        table.string('active',1).defaultTo(1);
      });
};

exports.down = function(knex, Promise) {
    
    return  knex.schema.table('accounts', function (table) {
        table.dropColumn('active');
    });
};