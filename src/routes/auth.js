module.exports = app => {
  app.route("/auth").post(app.src.controllers.auth.login);
  app.route("/auth/google").get(app.src.controllers.auth.google);
  app.route("/auth/google/callback").get(app.src.controllers.auth.callback);
  app.route("/auth/ok").get(app.src.controllers.auth.ok);
};