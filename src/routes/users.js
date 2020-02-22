module.exports = app => {
  app
    .route("/users/me")
    .all(app.src.config.auth.authenticate())
    .get(app.src.controllers.users.me);

  app.route("/users").post(app.src.controllers.users.register);
};
