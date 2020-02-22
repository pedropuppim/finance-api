const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt
const { jwtSecret } = require("./config.js");

module.exports = app => {

  const params = {
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  };

  const strategy = new Strategy(params, (payload, done) => {
   

      app.db('users')
          .where({ id: payload.user.id})
          .first()
          .then(user => {
              if (user) {

                if(payload.expire < Date.now()){
                  
                  return done(null, false);

                } else {
                  done(null, { id: user.id, name: user.name, email: user.email })
                }
            
              } else {
                done(null, false, 'Unauthorized');
              }
          })
          .catch(err => done(err, false))
  })

  passport.use(strategy)

  return {
      initialize: () => passport.initialize(),
      authenticate: () => passport.authenticate('jwt', { session: false }),
  }
}