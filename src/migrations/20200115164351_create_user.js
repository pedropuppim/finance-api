exports.up = function(knex) {
  return knex.schema.createTable("users", function(table) {
    table.increments();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.string('active', 1).defaultTo(1); 
    table.string('admin', 1).defaultTo("0"); 
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
