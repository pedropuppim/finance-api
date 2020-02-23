module.exports = app => {
    app.route("/accounts")
      .all(app.src.config.auth.authenticate())
      .get(app.src.controllers.accounts.list)
      .post(app.src.controllers.accounts.save);

   app.route("/accounts/:id")
      .all(app.src.config.auth.authenticate())
      .put(app.src.controllers.accounts.update)
      .delete(app.src.controllers.accounts.remove);
  };
  