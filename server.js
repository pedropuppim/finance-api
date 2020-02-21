const express = require("express");
const app = express();
const db = require("./src/config/db");
const consign = require("consign");

consign()
  .include("./src/config/auth.js")
  .then("./src/config/middlewares.js")
  .then("./src/controllers/")
  .then("./src/routes/")
  .then("./src/services/")
  .into(app);

app.db = db;

module.exports = app;