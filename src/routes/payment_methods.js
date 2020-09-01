module.exports = app => {
    app.route("/payment_methods")
    .all(app.src.config.auth.authenticate())
        .get(app.src.controllers.payment_methods.list)
        .post(app.src.controllers.payment_methods.save);

    app.route("/payment_methods/:id")
    .all(app.src.config.auth.authenticate())
      .put(app.src.controllers.payment_methods.update)
      .get(app.src.controllers.payment_methods.get)
      .delete(app.src.controllers.payment_methods.remove);
};
