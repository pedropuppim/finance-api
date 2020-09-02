exports.up = function (knex, Promise) {
    return knex.schema.alterTable('invoices', function (table) {
        table.integer('payment_method_id').unsigned();
        table.foreign('payment_method_id').references('id').inTable('payment_methods');
    });
};

exports.down = function (knex, Promise) {

    return knex.schema.table('invoices', function (table) {
        table.dropColumn('payment_method_id');
        table.dropForeign('payment_method_id');
    });
};