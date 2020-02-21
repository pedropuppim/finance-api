module.exports = app => {
  app.route("/auth").post(app.src.controllers.auth.login);
};
