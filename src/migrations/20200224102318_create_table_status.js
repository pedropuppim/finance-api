exports.up = function(knex) {
    return knex.schema.createTable("status", function(table) {
      table.increments();
      table.string("name").notNullable();
      table.string('active',1).defaultTo(1);  
      table.string("css").notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("status");
  };
  