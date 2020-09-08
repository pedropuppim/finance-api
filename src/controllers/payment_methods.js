const options = require("./../config/config");

module.exports = app => {

    const list = async (req, res) => {

        try {
            const payment_methods = await app.db('payment_methods').where({ active: 1 })
            .orderBy('id', 'desc');

            if (req.query.xlsx) {
                const fields = [
                    ['id','Id',50],
                    ['created_at', 'Data de Criação', 150],
                    ['name','Nome',300]                    
                ];

                const xlsx = await app.src.services.xlsx.getXlsx(fields, payment_methods);
                return res.status(200).json({ file: process.env.APP_URL_PUBLIC+xlsx});


            } else {
                return res.status(200).json(payment_methods);
            }
        } catch (error) {
            console.log(error);
        }


    };

    const get = async (req, res) => {

        const page = req.query.page || "1";

        if (!req.params.id) {
            return res.status(400).send('Id required')
        }

        try {
            const payment_methods = await app.db('payment_methods')
            .where({ active: 1, id: req.params.id })
            .first()
            .orderBy('id', 'desc');

            return res.status(200).json(payment_methods);

        } catch (error) {
            console.log(error);
        }


    };

    const save = async (req, res) => {

        if (!req.body.name) {
            return res.status(400).send('Name required')
        }

        try {
            await app.db('payment_methods')
            .insert(req.body)
            .then(_ => res.status(201).send())
            .catch(err => res.status(400).json(err))
        } catch (error) {
            console.log(error);
        }

    };

    const update = async (req, res) => {

        if (!req.body.name) {
            return res.status(400).send('Name required')
        } else {
            var name = req.body.name;
        }

        try {
            await app.db('payment_methods')
            .where({ id: req.params.id })
            .update({ name })
            .then(_ => res.status(200).json(req.body))
            .catch(err => res.status(400).json(err))
        } catch (error) {
            console.log(error);
        }

    };

    const remove = async (req, res) => {

        if (!req.params.id) {
            return res.status(400).send('Id required')
        }

        try {
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
        } catch (error) {
            console.log(error);
        }

    }

    return { list, save, update, remove, get };
};
