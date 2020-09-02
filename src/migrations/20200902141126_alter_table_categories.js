exports.up = function (knex, Promise) {
    return knex.schema.alterTable('categories', function (table) {
        table.string('type', 1).defaultTo(1);
    });
};

exports.down = function (knex, Promise) {

    return knex.schema.table('categories', function (table) {
        table.dropColumn('type');
    });
};