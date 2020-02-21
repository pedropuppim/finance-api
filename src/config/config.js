require("dotenv").config();

module.exports = {
  jwtSecret: process.env.SECRET_API_KEY || "secret",
  jwtSession: { session: false }
};
