const config = require("./../../knexfile.js");
const knex = require("knex")(config);
const setupPaginator = require("knex-paginator");
setupPaginator(knex);

module.exports = knex;