exports.up = function (knex) {
    return knex.schema.createTable("telephones", function (table) {
        table.increments();
        table.string("tel_number",12).notNullable();
        table.integer('company_id').unsigned();
        table.foreign('company_id').references('id').inTable('companies');
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.dateTime("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("telephones");
};

