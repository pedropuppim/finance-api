const jwt = require("jwt-simple");
const { jwtSecret } = require("../config/config");
const bcrypt = require("bcrypt");

module.exports = app => {
  const login = async (req, res) => {

    if (!req.body.email || !req.body.password) {
      return res.status(400).send('Dados incompletos')
    }

    const user = await app.db('users')
        .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
        .first()

    if (!user) return res.status(401).json({ msg: "User not found" });

    const isEqualPass = bcrypt.compareSync(req.body.password, user.password);

    if (!isEqualPass) return res.status(401).json({ msg: "Wrong password" });

    delete user.password;

    const token = jwt.encode({
      user: user,
      expire: Date.now() + (1000 * 60 * 60)
     }, jwtSecret);

    return res.status(200).json({ token, user });
        
    };

  return { login };
};
