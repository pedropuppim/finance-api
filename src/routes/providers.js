module.exports = app => {
    app.route("/providers")
      .all(app.src.config.auth.authenticate())
      .get(app.src.controllers.providers.list)
      .post(app.src.controllers.providers.save);

   app.route("/providers/:id")
      .all(app.src.config.auth.authenticate())
      .put(app.src.controllers.providers.update)
      .delete(app.src.controllers.providers.remove);
  };
  