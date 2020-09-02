const options = require("./../config/config");

module.exports = app => {

    const list = async (req, res) => {

        const page = req.query.page || "1";

        const companies = await app.db('companies').where({ active: 1 })
            .orderBy('id', 'desc');

        return res.status(200).json(companies);

    };

    const get = async (req, res) => {

        const page = req.query.page || "1";

        if (!req.params.id) {
            return res.status(400).send('Id required')
        }

        const companies = await app.db('companies as c')
            .where({ 'c.active': 1, 'c.id': req.params.id })
            .select("c.*", "t.tel_number","a.zip", "a.street", 	"a.complement", "a.number","a.neighborhood","a.city","a.state")
            .leftJoin('addresses as a', 'a.company_id', '=', 'c.id')
            .leftJoin('telephones as t', 't.company_id', '=', 'c.id')
            .first()
            .orderBy('c.id', 'desc');

        return res.status(200).json(companies);

    };

    const save = async (req, res) => {

        if (!req.body.name) {
            return res.status(400).send('Name required')
        }
        
        if (!req.body.tel_number) {
            return res.status(400).send('Tel number required')
        }

        try {
            const id = await app.db('companies')
            .insert({name: req.body.name});


            await app.db('telephones')
            .insert(
                {
                    tel_number: req.body.tel_number,
                    company_id: id
                });

            await app.db('addresses')
            .insert(
                {
                    company_id: id,
                    street: req.body.street,
                    number: req.body.number,
                    complement: req.body.complement,
                    neighborhood: req.body.neighborhood,
                    city: req.body.city,
                    state: req.body.state,
                    zip: req.body.zip
                });

            res.status(201).send();           
        } catch (error) {
            res.status(500).json(error);
        }

    };

    const update = async (req, res) => {

        if (!req.body.name) {
            return res.status(400).send('Name required')
        } else {
            var name = req.body.name;
        }

        try {
            await app.db('companies')
            .where({ id: req.params.id })
            .update({ name });

        await app.db('telephones')
            .where({ company_id: req.params.id })
            .update({ tel_number: req.body.tel_number });

        await app.db('addresses')
            .where({ company_id: req.params.id })
            .update({                 
                street: req.body.street,
                number: req.body.number,
                complement: req.body.complement,
                neighborhood: req.body.neighborhood,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip 
            });


         res.status(200).json(req.body);
        } catch (error) {
          res.status(500).json(error);
        }

    };

    const remove = async (req, res) => {

        if (!req.params.id) {
            return res.status(400).send('Id required')
        }

        await app.db('companies')
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
