const options = require("./../config/config");
var XLSX = require('xlsx');
const ExcelJS = require('exceljs');
const excel = require('node-excel-export');

module.exports = app => {


  const box_month = async (req, res) => {

    // const invoice = await app.db('invoices as i')
    //   .sum('i.amount as value')
    //   .select('i.type')
    //   .where({ 'i.active': 1 })
    //   .whereRaw('year(i.dt_duedate)=year(now( ))')
    //   .whereRaw('month(i.dt_duedate)=month(now( ))')
    //   .groupBy('i.type');

    // return res.status(200).json(invoice);

  

// You can define styles as json object
const styles = {
  header: {
    font: {
      bold: true,
    }
  },
};



//Here you specify the export structure
const specification = {
  customer_name: { // <- the key should match the actual data key
    displayName: 'Customer', // <- Here you specify the column header
    headerStyle: styles.header, // <- Header style
    width: 120 // <- width in pixels
  },
  status_id: {
    displayName: 'Status',
    headerStyle: styles.header,
    width: '10' // <- width in chars (when the number is passed as string)
  },
  note: {
    displayName: 'Description',
    headerStyle: styles.header,
    width: 220 // <- width in pixels
  }
}

const dataset = [
  {customer_name: 'IBM', status_id: 1, note: 'some note'},
  {customer_name: 'HP', status_id: 0, note: 'some note'},
  {customer_name: 'MS', status_id: 0, note: 'some note'}
]

const report = excel.buildExport(
  [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
    {
      name: 'Report', // <- Specify sheet name (optional)
      specification: specification, // <- Report specification
      data: dataset // <-- Report data
    }
  ]
);

// You can then return this straight
res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
return res.send(report);
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
