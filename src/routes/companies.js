module.exports = app => {
  app.route("/companies")
    .all(app.src.config.auth.authenticate())
    .get(app.src.controllers.companies.list)
    .post(app.src.controllers.companies.save);

  app.route("/companies/:id")
    .all(app.src.config.auth.authenticate())
    .put(app.src.controllers.companies.update)
    .delete(app.src.controllers.companies.remove);
};
