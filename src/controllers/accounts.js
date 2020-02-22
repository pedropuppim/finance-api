module.exports = app => {

  const list = async (req, res) => {
    
    const accounts = await app.db('accounts')
    
    return res.status(200).json(accounts);

  };

  const save = async (req, res) => {

    if (!req.body.name) {
        return res.status(400).send('Name required')
    }

    app.db('accounts')
        .insert(req.body)
        .then(_ => res.status(201).send())
        .catch(err => res.status(400).json(err))
  };

  const update = (req, res) => {

    const doneAt = new Date()
    
    if (!req.body.name) {
        return res.status(400).send('Name required')
    } else {
        var name = req.body.name;
    }

    app.db('accounts')
        .where({ id: req.params.id })
        .update({ name })
        .then(_ => res.status(200).json(req.body))
        .catch(err => res.status(400).json(err))
  }

  return { list, save, update };
};
