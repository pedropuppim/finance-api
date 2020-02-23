const config = require('./../../knexfile.js')
const knex = require('knex')(config)
// const Paginator = require('knex-paginator');

// Paginator(knex);

const { attachPaginate } = require('knex-paginate');
attachPaginate();



module.exports = knex