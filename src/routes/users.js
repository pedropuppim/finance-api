module.exports = app => {

  app.route("/users/verify_email").post(app.src.controllers.users.verifyEmail);
  app.route("/users").post(app.src.controllers.users.save);

  app
    .route("/users/me")
    .all(app.src.config.auth.authenticate())
    .get(app.src.controllers.users.me);

  app.route("/users")
    .all(app.src.config.auth.authenticate())
    .get(app.src.controllers.users.list);

  app.route("/users/:id")
    .all(app.src.config.auth.authenticate())
    .put(app.src.controllers.users.update)
    .get(app.src.controllers.users.get)
    .delete(app.src.controllers.users.remove);

};
