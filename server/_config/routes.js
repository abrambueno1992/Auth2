const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const User = require('../users/User');
const secret = 'that is what I shared yesterday lol';

const localStrategy = new LocalStrategy(function (username, password, done) {
  User.findOne({ username })
    .then(user => {
      if (!user) {
        done(null, false);
      } else {
        user
          .validatePassword(password)
          .then(isValid => {
            if (isValid) {
              const { _id, username } = user;
              return done(null, { _id, username }); // this ends in req.user
            } else {
              return done(null, false);
            }
          })
          .catch(err => {
            return done(err);
          });
      }
    })
    .catch(err => done(err));
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

const jwtStrategy = new JwtStrategy(jwtOptions, function (payload, done) {
  // here the token was decoded successfully
  User.findById(payload.sub)
    .then(user => {
      if (user) {
        done(null, user); // this is req.user
      } else {
        done(null, false);
      }
    })
    .catch(err => {
      done(err);
    });
});

// passport global middleware
passport.use(localStrategy);
passport.use(jwtStrategy);

// passport local middleware
const passportOptions = { session: false };
const authenticate = passport.authenticate('local', passportOptions);
const protected = passport.authenticate('jwt', passportOptions);



// routes
module.exports = function (server) {



  server.get('/api/users/', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log('res:', res)
    User.find()
      .select('username')
      .then(users => {
        res.send(users)
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
  //<<TESTED
  server.post('/api/register', function (req, res) {
    const user = new User(req.body);

    user
      .save()
      .then(user => res.status(201).send(user))
      .catch(err => res.status(500).send(err));
  });


  server.get('/api/logout', (req, res) => {
    req.logout();
    res.status(200).json("You are logged out")

  });

  server.get('/api/', protected, (req, res) => {

    console.log('This is the data inside api:', req);
    res.send(`Welcome back ${req.user.username}`)

  });
  //<<TESTED
  server.post('/api/login', authenticate, (req, res) => {
    res.status(200).json({ token: makeToken(req.user), user: req.user });

  });

  function makeToken(user) {
    const timestamp = new Date().getTime();
    const payload = {
      sub: user._id,
      iat: timestamp,
      username: user.username,
    };
    const options = {
      expiresIn: '24h',
    };

    let ttoken = jwt.sign(payload, secret, options);
    console.log('This is the token', ttoken);
    return ttoken;
  }


};
