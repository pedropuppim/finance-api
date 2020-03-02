exports.up = function (knex, Promise) {
    return knex.schema.alterTable('accounts', function (table) {
        table.decimal('balance', 12, 2).defaultTo(0);
    });
};

exports.down = function (knex, Promise) {

    return knex.schema.table('accounts', function (table) {
        table.dropColumn('balance');
    });

};