exports.up = function (knex) {
    return knex.schema.createTable("categories", function (table) {
        table.increments();
        table.string("name").notNullable();
        table.string('active', 1).defaultTo(1);
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.dateTime("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("categories");
};
