// import { Server } from 'tls';

const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../users/User');
const secret = 'Thas is what I shared yesterday lol';



// router.post('/register', function(req, res) {
//   console.log('posting', req.body);
//   User.create(req.body) // new User + user.save
//     .then(user => {
//       const token = makeToken(user);
//       res.status(201).json(user);
//     })
//     .catch(err => res.status(500).json(err));
// });
// router.post('/login', authenticate, (req,res) => {
//   // if we're here, the user logged in correctly
// });
// function makeToken(user) {
//   //build that token
//   const timestamp = new Date().getTime();
//   const payload = {
//     sub: user._id,
//     iat: timestamp,
//     username: user.username
//   };
//   const options = {
//     expiresIn: '24h'
//   };
//   return jwt.sign(payload, secret, options)
// }
// module.exports = router;
