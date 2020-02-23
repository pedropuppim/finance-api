const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = app => {

  const me = async (req, res) => {
      res.json(req.user);
  };

  return { me };
};
