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

// helpers
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

  return jwt.sign(payload, secret, options);
}
// function authenticate(req, res, next) {
//   if (req.session && req.session.username) {
//     next();
//   } else {
//     res.status(401).send('You shall not pass!!');
//   }
// }

// routes
module.exports = function (server) {
  //<<FAILS

  // server.get('/users', protected, (req, res) => {
  //   User.find()
  //     .select('username')
  //     .then(users => {
  //       res.json(users);
  //     })
  //     .catch(err => {
  //       res.status(500).json(err);
  //     });
  // });



  server.get('/api/users', protected, (req, res) => {
    User.find()
      .select('username')
      .then(users => {
        res.json(users);
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
    if (req.session) {
      console.log('Current Session logout, session:', req.session);
      req.session.destroy(function (err) {
        if (err) {
          res.send("error");
        } else {
          res.send('Goodbye');
        }
      });
    };
  });

  server.get('/api/', (req, res) => {

    // if (req.session && req.session.username) {
    //   res.send(`Welcome back ${req.session.username}`)
    // } else {
    //   res.send("Who are you, really? Don't lie to me!")
    // }
  });
//<<TESTED
  server.post('/api/login', authenticate, (req, res) => {
    res.status(200).json({token: makeToken(req.user), user: req.user});
  //   const { username, password } = req.body;
  //   const passBody = req.body.password;

  //   const userInfo = { username, password };
  //   User.findOne({ username })
  //     .then(user => {
  //       if (user) {
  //         user.isPasswordValid(password).then(isValid => {
  //           if (isValid) {
  //             req.session.username = user.username;
  //             res.send("Have a cookie");

  //           } else {
  //             res.status(401).send('Invalid user-name')
  //           }
  //         });
  //       } else {
  //         res.status(404).send("Invalid PASSWORD")
  //       }
  //     }).catch(err => res.send(err))
  });
};
