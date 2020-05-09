const user = require('../models/user');
const { Order } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

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

exports.addOrderToUserHistory = (req, res, next) => {
  let history = [];
  req.body.order.products.forEach(item => {
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.count,
      transaction_Id: req.body.order.transaction_Id,
      amount: req.body.order.amount
    });
  });

  user.findOneAndUpdate({ _id: req.profile._id }, { $push: { history: history } }, { new: true }, (error, data) => {
    if (error) {
      return res.status(400).json({
        error: 'Could not update users purchase history'
      });
    }
    next();
  });
};

exports.purchaseHistory = (req, res) => {
  Order.find({ user: req.profile.id })
    .populate('user', '_id name')
    .sort('-created')
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      console.log(orders);
      res.json(orders);
    });
};
