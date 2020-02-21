const jwt = require("jwt-simple");
const { jwtSecret } = require("../config/config");
const bcrypt = require("bcrypt");

module.exports = () => {
  const login = async (req, res) => {

    if (!req.body.email || !req.body.password) {
      return res.status(400).send('Dados incompletos')
    }

    const user = await app.db('users')
        .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
        .first()
    };

  return { login };
};
