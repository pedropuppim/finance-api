const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = app => {

  const me = async (req, res) => {
      res.json(req.user);
  };

  const list = async (req, res) => {

    try {

      const users = await app.db('users')
      .select(
          "id", "created_at", "name", "admin", "email",
        app.db.raw("CASE WHEN admin = 0 THEN 'Admin' ELSE 'Regular' END AS name_type")
      )
      .where({ active: 1 })
      .orderBy('id', 'desc');

      console.log(users);

      if (req.query.pdf) {
        const fields = [
          ['id', 'Id', 50],
          ['created_at', 'Data de Criação', 150],
          ['name', 'Nome', 300],
          ['email', 'E-mail', 300],
          ['name_type', 'Tipo', 300]
        ];

        const xlsx = await app.src.services.xlsx.getXlsx(fields, users);
        return res.status(200).json({ pdf_file: process.env.APP_URL_PUBLIC + xlsx });

      } else {
        return res.status(200).json(users);
      }

    } catch (error) {
      console.log(error);
    }
    

  };

  const verifyEmail = async (req, res) => {


    if (!req.body.email) {
      return res.status(400).send('E-mail required')
    }

    const users = await app.db('users')
      .select('email')
      .where({ email: req.body.email })
      .first()
      .orderBy('id', 'desc');

    return res.status(200).json(users);

  };

  const get = async (req, res) => {

    const page = req.query.page || "1";

    if (!req.params.id) {
      return res.status(400).send('Id required')
    }

    const users = await app.db('users')
      .select('name', 'email', 'admin')
      .where({ active: 1, id: req.params.id })
      .first()
      .orderBy('id', 'desc');

    return res.status(200).json(users);

  };

  const save = async (req, res) => {


    if (!req.body.name) {
      return res.status(400).send('Nome required')
    }

    if (!req.body.email) {
      return res.status(400).send('E-mail required')
    }

    if (req.body.password && req.body.password2) {

      if (req.body.password2 != req.body.password) {
        return res.status(400).send('As senha não conferem')
      }

      delete req.body.password2;
      
      const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
      req.body.password = hashedPassword;

    }


    await app.db('users')
      .insert(req.body)
      .then(_ => res.status(201).send())
      .catch(err => res.status(400).json(err))
  };

  const update = async (req, res) => {

    if (!req.body.name) {
      return res.status(400).send('Name required')
    } else {
      var name = req.body.name;
    }

    await app.db('users')
      .where({ id: req.params.id })
      .update({ name })
      .then(_ => res.status(200).json(req.body))
      .catch(err => res.status(400).json(err))
  };

  const remove = async (req, res) => {

    if (!req.params.id) {
      return res.status(400).send('Id required')
    }

    await app.db('users')
      .where({ id: req.params.id })
      .update({ active: 0 })
      .then(_ => res.status(201).send())
      .catch(err => res.status(400).json(err))
  }

  return { me, list, get, save, update, remove, verifyEmail };
};
