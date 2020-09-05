const jwt = require("jwt-simple");
const { jwtSecret } = require("../config/config");
const bcrypt = require("bcrypt");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { v4: uuidv4 } = require('uuid');

module.exports = app => {

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  const findOrCreate = async (profile) => {

    user = await app.db('users')
      .whereRaw("LOWER(email) = LOWER(?)", profile.email)
      .first()

    if (!user) {

        const password = uuidv4();
        
        try {
          user = await app.db('users').insert({ email: profile.email, name: profile.name, password })
        } catch (error) {
          console.log(error);
        }
      
    }

    delete user.password;

    const expire = Date.now() + (1000 * 60 * 60);

    const token = jwt.encode({
      user: user,
      expire: expire
    }, jwtSecret);

    return { token, user, expire };

  }

  const google = async (req, res, next) => {

    passport.authenticate('google', { scope: ['openid', 'email', 'profile'] })(req, res, next);
  };

  const ok = async (req, res, next) => {
    return res.status(201).json();
  };

  const me = async (req, res, next) => {
    return res.status(200).json(req.body);
  };

  const callback = async (req, res, next) => {

    passport.authenticate('google', async function (err, user, info) {

      console.log(err, user, info);

      if (user._json){

        await findOrCreate(user._json)
          .then(user => {
            return res.redirect(process.env.SITE_CALLBACK_URL+'?token='+user.token);
            //return res.status(200).json(user);
          })
          .catch(err => {
            return res.status(500)
          });
      }

    })(req, res, next);

  };


  const login = async (req, res) => {

    if (!req.body.email || !req.body.password) {
      return res.status(400).send('Dados incompletos')
    }

    const user = await app.db('users')
        .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
        .first()

    if (!user) return res.status(401).json({ msg: "User not found" });

    const isEqualPass = bcrypt.compareSync(req.body.password, user.password);

    if (!isEqualPass) return res.status(401).json({ msg: "Wrong password" });

    delete user.password;

    const expire = Date.now() + (1000 * 60 * 60);

    const token = jwt.encode({
      user: user,
      expire: expire
     }, jwtSecret);

    return res.status(200).json({ token, user, expire });
        
    };

  return { login, google, ok, callback, me };
};
