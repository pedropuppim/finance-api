const options = require("./../config/config");

module.exports = app => {

    const list = async (req, res) => {

        const page = req.query.page || "1";


        try {
            const categories = await app.db('categories')
            .select(
                "id", "created_at", "name", "type",
              app.db.raw("CASE WHEN type = 2 THEN 'Receber' ELSE 'Pagar' END AS name_type")
            ).where({ active: 1 })
            .orderBy('type', 'desc')
            .orderBy('name', 'asc');

            if (req.query.xlsx) {
                const fields = [
                    ['id','Id',50],
                    ['created_at', 'Data de Criação', 150],
                    ['name','Nome',300],                    
                    ['name_type','Tipo',200],                    
                ];

                const xlsx = await app.src.services.xlsx.getXlsx(fields, categories);
                return res.status(200).json({ file: process.env.APP_URL_PUBLIC+xlsx});


            } else {
                return res.status(200).json(categories);
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
            const categories = await app.db('categories')
            .where({ active: 1, id: req.params.id })
            .first()
            .orderBy('id', 'desc');

            return res.status(200).json(categories);
        } catch (error) {
            console.log(error);
        }


    };

    const save = async (req, res) => {

        if (!req.body.name) {
            return res.status(400).send('Name required')
        }

        try {
            await app.db('categories')
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
            var type = req.body.type;
        }

        try {
            await app.db('categories')
            .where({ id: req.params.id })
            .update({ name, type })
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
            await app.db('categories')
            .where({ id: req.params.id })
            .update({ active: 0 })
            .then(_ => res.status(201).send())
            .catch(err => res.status(400).json(err))
        } catch (error) {
            console.log(error);
        }

    }

    return { list, save, update, remove, get };
};
