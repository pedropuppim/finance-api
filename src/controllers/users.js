const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = app => {

  const me = async (req, res) => {
    
      res.json(req.user);

  };

  const register = async (req, res) => {

    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

    try {
      const user = req.body;

      console.log(user);

      //delete user.password;

      return res.status(200).json({ user });
    } catch (e) {
      return res.status(500).json({ error: "Something went wrong." });
    }
  };

  return { me, register };
};
