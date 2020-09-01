const options = require("./../config/config");

module.exports = app => {

    const list = async (req, res) => {

        const page = req.query.page || "1";

        const payment_methods = await app.db('payment_methods').where({ active: 1 })
            .orderBy('id', 'desc');

        return res.status(200).json(payment_methods);

    };

    const get = async (req, res) => {

        const page = req.query.page || "1";

        if (!req.params.id) {
            return res.status(400).send('Id required')
        }

        const payment_methods = await app.db('payment_methods')
            .where({ active: 1, id: req.params.id })
            .first()
            .orderBy('id', 'desc');

        return res.status(200).json(payment_methods);

    };

    const save = async (req, res) => {

        if (!req.body.name) {
            return res.status(400).send('Name required')
        }

        await app.db('payment_methods')
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

        await app.db('payment_methods')
            .where({ id: req.params.id })
            .update({ name })
            .then(_ => res.status(200).json(req.body))
            .catch(err => res.status(400).json(err))
    };

    const remove = async (req, res) => {

        if (!req.params.id) {
            return res.status(400).send('Id required')
        }

        await app.db('payment_methods')
            .where({ id: req.params.id, active: 1 })
            .update({ active: 0 })
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `record not found with id ${req.params.id}.`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    return { list, save, update, remove, get };
};
