
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('status').del()
    .then(function () {
      // Inserts seed entries
      return knex('status').insert([
        {id: 1, name: 'Open', css: 'secondary'},
        {id: 2, name: 'Paid', css: 'success'},
        {id: 3, name: 'Canceled', css: 'danger'}
      ]);
    });
};
