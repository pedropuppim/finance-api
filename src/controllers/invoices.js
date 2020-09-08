const options = require("./../config/config");

module.exports = app => {

  const list = async (req, res) => {

    const page = req.query.page || "1";

      var dt = new Date(),
      month = dt.getMonth(),
      year = dt.getFullYear();

      var FirstDay = new Date(year, month, 1);
      var LastDay = new Date(year, month + 1, 0);

      try {

        var perPage = options.paginate.recordsPerPage;

        //set ulimited records for export execel
        if (req.query.xlsx) { perPage=10000; }

        const invoices = await app.db('invoices as i')
        .select("i.*", "pm.name as name_payment_method", "ca.name as name_category", "a.name as name_account", "c.name as name_company", "s.name as name_status", "s.css as css_status")
        .select(app.db.raw("CASE WHEN i.type = 2 THEN 'Receber' ELSE 'Pagar' END AS name_type"))
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
        .paginate({ perPage: perPage, currentPage: page, isLengthAware: true });
  
        if (req.query.xlsx) {
            const fields = [
                ['id','Id',50],
                ['dt_duedate', 'Vencimento', 150],
                ['amount', 'Valor', 150],
                ['name_company','Cliente / Fornecedor',300],                    
                ['name_account','Conta',300],                    
                ['name_category','Categoria',300],                    
                ['name_payment_method','Método de Pagamento',300],                    
                ['name_type','Tipo',300],                    
                ['name_status','Status',300]                   
            ];

            const xlsx = await app.src.services.xlsx.getXlsx(fields, invoices.data);
            return res.status(200).json({ file: process.env.APP_URL_PUBLIC+xlsx});


        } else {
            return res.status(200).json(invoices);
        }
    } catch (error) {
        console.log(error);
    }

  };

  const get = async (req, res) => {

    if (!req.params.id) {
      return res.status(400).send('Id required')
    }

    try {
      const invoice = await app.db('invoices as i')
      .select("i.*", "a.name as name_account", "c.name as name_company", "s.name as name_status", "s.css as css_status")
      .join('accounts as a', 'a.id', '=', 'i.account_id')
      .join('companies as c', 'c.id', '=', 'i.company_id')
      .join('status as s', 's.id', '=', 'i.status')
      .where({ 'i.active': 1 })
      .where({ 'i.id': req.params.id })
      .first();

      return res.status(200).json(invoice);
    } catch (error) {
      console.log(error);
    }



  };

  const save = async (req, res) => {

    try {
      await app.db('invoices')
      .insert(req.body)
      .then(_ => res.status(201).send())
      .catch(err => res.status(400).json(err))
    } catch (error) {
      console.log(error);
    }

  };

  const update = async (req, res) => {

    try {
      await app.db('invoices')
      .where({ id: req.params.id })
      .update(req.body)
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
    } catch (error) {
      console.log(error);
    }

  }

  return { list, get, save, update, remove };
};
