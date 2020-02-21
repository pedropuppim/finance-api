const passport = require("passport");
const passportJWT = require("passport-jwt");
const { jwtSecret, jwtSession } = require("./config.js");
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = () => {
  passport.use(
    new Strategy(params, async (payload, done) => {
      if (payload && payload.id) {
        const user = payload;
        console.log(user);
        
        if (user) {
          delete user.password;

          return done(null, user);
        }
      }
  
      return done(null, false, { message: "Not Authorized." });
    })
  );

  const initialize = () => passport.initialize();

  const authenticate = passport.authenticate("jwt", jwtSession);

  return { initialize, authenticate };
};
