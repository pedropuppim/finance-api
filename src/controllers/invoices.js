const options = require("./../config/config");

module.exports = app => {

  const list = async (req, res) => {
    
    const page = req.query.page || "1";

    const invoices = await app.db('invoices as i')
    .select("i.*","c.name as name_account","s.name as name_status","s.css as css_status")
    .join('accounts as c', 'c.id', '=', 'i.account_id')
    .join('status as s', 's.id', '=', 'i.status')
    .where({ 'i.active': 1 })
    .modify(function(queryBuilder) {
      if(req.query.status) {
          queryBuilder.where('i.status', '=',req.query.status )
      }
    })
    .orderBy('i.id', 'desc')
    .paginate({ perPage: options.paginate.recordsPerPage, currentPage: page, isLengthAware: true });

    return res.status(200).json(invoices);
    

  };

  const save = async (req, res) => {

    await app.db('invoices')
        .insert(req.body)
        .then(_ => res.status(201).send())
        .catch(err => res.status(400).json(err))
  };

  const update = async (req, res) => {

    await app.db('invoices')
        .where({ id: req.params.id })
        .update(req.body)
        .then(_ => res.status(200).json(req.body))
        .catch(err => res.status(400).json(err))
  };

  const remove = async (req, res) => {

    
    if (!req.params.id) {
        return res.status(400).send('Id required')
    } 

    await app.db('invoices')
        .where({ id: req.params.id, active: 1 })
        .update({active: 0})
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

  return { list, save, update, remove };
};