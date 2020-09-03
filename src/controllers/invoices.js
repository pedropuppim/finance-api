const options = require("./../config/config");

module.exports = app => {

  const list = async (req, res) => {

    const page = req.query.page || "1";

      var dt = new Date(),
      month = dt.getMonth(),
      year = dt.getFullYear();

      var FirstDay = new Date(year, month, 1);
      var LastDay = new Date(year, month + 1, 0);

    const invoices = await app.db('invoices as i')
      .select("i.*", "pm.name as name_payment_method", "ca.name as name_category", "a.name as name_account", "c.name as name_company", "s.name as name_status", "s.css as css_status")
      .join('accounts as a', 'a.id', '=', 'i.account_id')
      .join('status as s', 's.id', '=', 'i.status')
      .join('companies as c', 'c.id', '=', 'i.company_id')
      .join('categories as ca', 'ca.id', '=', 'i.category_id')
      .join('payment_methods as pm', 'pm.id', '=', 'i.payment_method_id')
      .where({ 'i.active': 1 })
      .modify(function (queryBuilder) {
        if (req.query.status) {
          queryBuilder.where('i.status', '=', req.query.status)
        }
        if (req.query.type) {
          queryBuilder.where('i.type', '=', req.query.type)
        }
        if (req.query.date_inicial) {
          queryBuilder.where('i.dt_duedate', '>=', req.query.date_inicial)
        }else{
          queryBuilder.where('i.dt_duedate', '>=', FirstDay)
        }
        if (req.query.date_final) {
          queryBuilder.where('i.dt_duedate', '<=', req.query.date_final)
        }else{
          queryBuilder.where('i.dt_duedate', '<=', LastDay)
        }

      })
      .orderBy('i.dt_duedate', 'asc')
      .paginate({ perPage: options.paginate.recordsPerPage, currentPage: page, isLengthAware: true });


    return res.status(200).json(invoices);


  };

  const get = async (req, res) => {

    if (!req.params.id) {
      return res.status(400).send('Id required')
    }

    const invoice = await app.db('invoices as i')
      .select("i.*", "a.name as name_account", "c.name as name_company", "s.name as name_status", "s.css as css_status")
      .join('accounts as a', 'a.id', '=', 'i.account_id')
      .join('companies as c', 'c.id', '=', 'i.company_id')
      .join('status as s', 's.id', '=', 'i.status')
      .where({ 'i.active': 1 })
      .where({ 'i.id': req.params.id })
      .first();

    return res.status(200).json(invoice);


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

  return { list, get, save, update, remove };
};
