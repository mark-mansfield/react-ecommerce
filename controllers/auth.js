const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {
  console.log('req body ', req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err)
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user
    });
  });
};

exports.signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: 'User with that email does not exist. Please signup'
      });
    }
    // test for invalid creds first
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Email and password do not match'
      });
    }
    // generate a user token with user id an a secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // persist the token as 't' in cookie with expiry date

    res.cookie('t', token, { expire: new Date() + 9999 });

    //return response with user and token to frontend client

    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

exports.hello = (req, res) => {
  res.json('hello there');
};

exports.signout = (req, res) => {
  // clear cookie from response
  res.clearCookie('t');
  res.json({ message: 'sign out successful' });
};

// middlewear
exports.requireSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
  // prevent user trying to access other user's profile
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: 'access denied'
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  // admin role = 1, user role = 0
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'admin resource! access denied'
    });
  }
  next();
};
