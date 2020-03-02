exports.up = function (knex, Promise) {
    return knex.schema.alterTable('invoices', function (table) {
        table.string('type', 1).defaultTo(0);
    });
};

exports.down = function (knex, Promise) {

    return knex.schema.table('invoices', function (table) {
        table.dropColumn('type');
    });
};