require("dotenv").config();

module.exports = {
  client: "mysql",
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: "./src/migrations/",
  },
  seeds: {
    directory: "./src/seeds/"
  },
  debug: process.env.DEBUG_MODE
};
