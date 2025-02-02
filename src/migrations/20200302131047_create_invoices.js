exports.up = function (knex) {
  return knex.schema.createTable("invoices", function (table) {
    table.increments();
    table.integer('account_id').unsigned();
    table.foreign('account_id').references('id').inTable('accounts');
    table.integer('company_id').unsigned();
    table.foreign('company_id').references('id').inTable('companies');
    table.string("description").notNullable();
    table.decimal("amount", 12, 2);
    table.date("dt_duedate");
    table.string('status', 1).defaultTo(0);
    table.string('active', 1).defaultTo(1);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("invoices");
};


  //decimal — 