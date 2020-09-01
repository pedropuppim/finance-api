module.exports = app => {
    app.route("/categories")
    .all(app.src.config.auth.authenticate())
        .get(app.src.controllers.categories.list)
        .post(app.src.controllers.categories.save);

    app.route("/categories/:id")
    .all(app.src.config.auth.authenticate())
      .put(app.src.controllers.categories.update)
      .get(app.src.controllers.categories.get)
      .delete(app.src.controllers.categories.remove);
};
