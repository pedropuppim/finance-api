module.exports = app => {
  app.route("/dashboard/box_month")
    .get(app.src.controllers.dashboard.box_month)

    app.route("/dashboard/pay_month_by_category")
    .all(app.src.config.auth.authenticate())
    .get(app.src.controllers.dashboard.pay_month_by_category)  
    
    
    app.route("/dashboard/flow_month")
    .all(app.src.config.auth.authenticate())
    .get(app.src.controllers.dashboard.flow_month)


    app.route("/dashboard/pay_month_by_companies")
    .all(app.src.config.auth.authenticate())
    .get(app.src.controllers.dashboard.pay_month_by_companies)  


    app.route("/dashboard/receive_month_by_companies")
    .all(app.src.config.auth.authenticate())
    .get(app.src.controllers.dashboard.receive_month_by_companies)  
};
