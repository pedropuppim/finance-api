const options = require("./../config/config");

module.exports = app => {


  const box_month = async (req, res) => {

    const invoice = await app.db('invoices as i')
      .sum('i.amount as value')
      .select('i.type')
      .where({ 'i.active': 1 })
      .whereRaw('year(i.dt_duedate)=year(now( ))')
      .whereRaw('month(i.dt_duedate)=month(now( ))')
      .groupBy('i.type');

    return res.status(200).json(invoice);

  };

  const pay_month_by_category = async (req, res) => {


    const invoice = await app.db('invoices as i')
      .sum('i.amount as value')
      .select('i.category_id','c.name as category_name')
      .join('categories as c', 'c.id', '=', 'i.category_id')
      .where({ 'i.active': 1 })
      .whereNot({ 'i.status': 3 })
      .whereRaw('year(i.dt_duedate)=year(now( ))')
      .whereRaw('month(i.dt_duedate)=month(now( ))')
      .groupBy('i.category_id')
      .limit(10);

    return res.status(200).json(invoice);

  };

  const flow_month = async (req, res) => {

    //SUM(IF(debito_credito_financeiro = 'D', valor_financeiro, 0))
    const invoice = await app.db('invoices as i')
      .select(app.db.raw('sum(if(i.type=1, i.amount, 0))as pay'))
      .select(app.db.raw('sum(if(i.type=2, i.amount, 0))as receive'))
      .select(app.db.raw('day(i.dt_duedate) as day'))
      .where({ 'i.active': 1 })
      .whereNot({ 'i.status': 3 })
      .whereRaw('year(i.dt_duedate)=year(now( ))')
      .whereRaw('month(i.dt_duedate)=month(now( ))')
      .groupByRaw('day( dt_duedate )')
      .orderByRaw('day( dt_duedate ) asc');

    return res.status(200).json(invoice);

  };

  const pay_month_by_companies = async (req, res) => {

    const invoice = await app.db('invoices as i')
      .sum('i.amount as value')
      .select('i.company_id','c.name as company_name')
      .join('companies as c', 'c.id', '=', 'i.company_id')
      .where({ 'i.active': 1 })
      .where({ 'i.type': 1 })
      .whereNot({ 'i.status': 3 })
      .whereRaw('year(i.dt_duedate)=year(now( ))')
      .whereRaw('month(i.dt_duedate)=month(now( ))')
      .groupBy('i.company_id')
      .limit(5);
      
      return res.status(200).json(invoice);
  };


  const receive_month_by_companies = async (req, res) => {


    const invoice = await app.db('invoices as i')
      .sum('i.amount as value')
      .select('i.company_id','c.name as company_name')
      .join('companies as c', 'c.id', '=', 'i.company_id')
      .where({ 'i.active': 1 })
      .where({ 'i.type': 2 })
      .whereNot({ 'i.status': 3 })
      .whereRaw('year(i.dt_duedate)=year(now( ))')
      .whereRaw('month(i.dt_duedate)=month(now( ))')
      .groupBy('i.company_id')
      .limit(5);

    return res.status(200).json(invoice);

  };


  return { box_month, pay_month_by_category, flow_month, pay_month_by_companies, receive_month_by_companies };
};
