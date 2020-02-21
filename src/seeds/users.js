const bcrypt = require("bcrypt");
const saltRounds = 10;
const hashedPassword = bcrypt.hashSync("1234", saltRounds);

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        { id: 1, name: "Gabriel", email: "gabriel@email.com", password: hashedPassword },
        { id: 2, name: "Test", email: "test@email.com", password: hashedPassword },
        { id: 3, name: "Test2", email: "test2@email.com", password: hashedPassword }
      ]);
    });
};
