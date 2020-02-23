module.exports = app => {
  app
    .route("/users/me")
    .all(app.src.config.auth.authenticate())
    .get(app.src.controllers.users.me);
};
