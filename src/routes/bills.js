module.exports = app => {
    app.route("/bills")
      .all(app.src.config.auth.authenticate())
      .get(app.src.controllers.bills.list)
      .post(app.src.controllers.bills.save);

   app.route("/bills/:id")
      .all(app.src.config.auth.authenticate())
      .put(app.src.controllers.bills.update)
      .delete(app.src.controllers.bills.remove);
  };
  