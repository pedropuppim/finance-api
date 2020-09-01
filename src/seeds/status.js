
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('status').del()
    .then(function () {
      // Inserts seed entries
      return knex('status').insert([
        {id: 1, name: 'Em Aberto', css: 'secondary'},
        {id: 2, name: 'Pago', css: 'success'},
        {id: 3, name: 'Cancelado', css: 'danger'}
      ]);
    });
};
