exports.up = function (knex, Promise) {
    return knex.schema.alterTable('invoices', function (table) {
        table.integer('category_id').unsigned();
        table.foreign('category_id').references('id').inTable('categories');
    });
};

exports.down = function (knex, Promise) {

    return knex.schema.table('invoices', function (table) {
        table.dropColumn('category_id');
        table.dropForeign('category_id');
    });
};