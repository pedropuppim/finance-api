const bodyParser = require("body-parser");
const cors = require("cors");
var cookieParser = require("cookie-parser");

module.exports = app => {
  app.disable("x-powered-by");

  app.use((req, res, next) => {
    res.set("Server", "Unknow");
    next();
  });

  app.use(cookieParser());

  app.use(bodyParser.json({
    parameterLimit: 100000,
    limit: "50mb",
    extended: true
  }));

  app.use(app.src.config.auth.initialize());

  app.use(cors({
    origin: '*'
  }))

};