module.exports = app => {
    app.route("/customers")
      .all(app.src.config.auth.authenticate())
      .get(app.src.controllers.customers.list)
      .post(app.src.controllers.customers.save);

   app.route("/customers/:id")
      .all(app.src.config.auth.authenticate())
      .put(app.src.controllers.customers.update)
      .delete(app.src.controllers.customers.remove);
  };
  