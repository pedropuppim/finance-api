const options = require("./../config/config");

module.exports = app => {

    const list = async (req, res) => {

        const page = req.query.page || "1";

        const categories = await app.db('categories').where({ active: 1 })
            .orderBy('type', 'desc',)
            .orderBy('name', 'asc',);

        return res.status(200).json(categories);

    };

    const get = async (req, res) => {

        const page = req.query.page || "1";

        if (!req.params.id) {
            return res.status(400).send('Id required')
        }

        const categories = await app.db('categories')
            .where({ active: 1, id: req.params.id })
            .first()
            .orderBy('id', 'desc');

        return res.status(200).json(categories);

    };

    const save = async (req, res) => {

        if (!req.body.name) {
            return res.status(400).send('Name required')
        }

        await app.db('categories')
            .insert(req.body)
            .then(_ => res.status(201).send())
            .catch(err => res.status(400).json(err))
    };

    const update = async (req, res) => {

        if (!req.body.name) {
            return res.status(400).send('Name required')
        } else {
            var name = req.body.name;
            var type = req.body.type;
        }

        await app.db('categories')
            .where({ id: req.params.id })
            .update({ name, type })
            .then(_ => res.status(200).json(req.body))
            .catch(err => res.status(400).json(err))
    };

    const remove = async (req, res) => {

        if (!req.params.id) {
            return res.status(400).send('Id required')
        }

        await app.db('categories')
            .where({ id: req.params.id })
            .update({ active: 0 })
            .then(_ => res.status(201).send())
            .catch(err => res.status(400).json(err))
    }

    return { list, save, update, remove, get };
};
