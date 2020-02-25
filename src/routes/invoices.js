module.exports = app => {
    app.route("/invoices")
      .all(app.src.config.auth.authenticate())
      .get(app.src.controllers.invoices.list)
      .post(app.src.controllers.invoices.save);

   app.route("/invoices/:id")
      .all(app.src.config.auth.authenticate())
      .put(app.src.controllers.invoices.update)
      .delete(app.src.controllers.invoices.remove);
  };
  