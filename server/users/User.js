const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const loginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4, // make this at least 12 in production
  },
});

loginSchema.pre('save', function(next) {
  bcrypt.hash(this.password, 11, (err, hash) => {
      if (err) {
          return next(err);
      } 
      // else {
          this.password = hash;
          return next();
      // }
  })
});


loginSchema.methods.validatePassword = function(passwordGuess) {
  return bcrypt.compare(passwordGuess, this.password);
};


module.exports = mongoose.model('User', loginSchema);
