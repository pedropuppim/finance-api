exports.up = function (knex) {
    return knex.schema.createTable("addresses", function (table) {
        table.increments();
        table.string("zip",8).notNullable();
        table.string("street").notNullable();
        table.string("complement");
        table.string("number").notNullable();
        table.string("neighborhood").notNullable();
        table.string("city",100).notNullable();
        table.string("state",2).notNullable();
        table.integer('company_id').unsigned();
        table.foreign('company_id').references('id').inTable('companies');
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.dateTime("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("addresses");
};
