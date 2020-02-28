exports.up = function (knex) {
  return knex.schema.createTable("companies", function (table) {
    table.increments();
    table.string("name").notNullable();
    table.string('type', 1).defaultTo(1);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.dateTime("updatedAt").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.string('active', 1).defaultTo(1);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("companies");
};
