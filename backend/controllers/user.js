const user = require('../models/user');

exports.userById = (req, res, next, id) => {
  user.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'user not found'
      });
    }
    req.profile = user;
    next();
  });
};

exports.read = (req, res) => {
  // do not return the password or salt
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.update = (req, res) => {
  user.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true }, (err, user) => {
    if (err) {
      return res.status(400).json({
        error: 'You are not allowed to perform this action'
      });
    }
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    res.json(user);
  });
};
