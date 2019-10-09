const formidable = require('formidable');
const { errorHandler } = require('../helpers/dbErrorHandler');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');

exports.update = (req, res) => {
  // handle form data and files

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (error, fields, files) => {
    if (error) {
      res.status(400).json({ error: ' image could not be uploaded' });
      return;
    }

    // validate for all fields required
    const { name, description, price, category, quantity, shipping } = fields;
    if (!name || !description || !price || !category || !quantity || !shipping) {
      res.status(400).json({
        error: 'all fields are required'
      });
      return;
    }
    let product = req.product;
    // lodash   updates all the fields using the product and the fields as params.
    product = _.extend(product, fields);
    if (files.photo) {
      if (files.photo.size > 1000000) {
        res.status(400).json({ error: ' image should be less than 1mb in size' });
        return;
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    product.save((err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          error: errorHandler(err)
        });
        return;
      }
      res.json(result);
    });
  });
};

exports.remove = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.json({
      message: 'product deleted'
    });
  });
};

exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({ error: 'Product not found' });
    }
    req.product = product;
    next();
  });
};

exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.create = (req, res) => {
  // handle form data and files

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (error, fields, files) => {
    if (error) {
      res.status(400).json({ error: ' image could not be uploaded' });
      return;
    }
    // validate for all fields required
    const { name, description, price, category, quantity, shipping } = fields;
    if (!name || !description || !price || !category || !quantity || !shipping) {
      res.status(400).json({
        error: 'all fields are required'
      });
      return;
    }
    let product = new Product(fields);
    if (files.photo) {
      // 1kb = 1000
      // 1mb = 1 000 000
      // validate file size
      if (files.photo.size > 1000000) {
        res.status(400).json({ error: ' image should be less than 1mb in size' });
        return;
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          error: errorHandler(err)
        });
        return;
      }
      res.json(result);
    });
  });
};

// return products based on most popular
// by most popular query format = /products?sortBy=sold&order=desc&limit=4

// return products based on new arrivals
// based on arrival format = /products?sortBy=createdAt&order=desc&limit=4

// if no params sent, then all products are returned
exports.list = (req, res) => {
  // options use supplied params, or last value in the ternary, which is the default
  let order = req.query.order ? req.query.order : 'asc';
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: 'product not found'
        });
      }
      res.json(products);
    });
};

// list all products based on the request product category
//  other products that have the same category will be returned
// find all related not including  current product
exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find({
    _id: { $ne: req.product },
    category: req.product.category
  })
    .limit(limit)
    .populate('category', '_id name')
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: 'products not found'
        });
      }
      res.json(products);
    });
};

exports.listCategories = (req, res) => {
  Product.distinct('category', {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: 'categories not found'
      });
    }
    res.json(categories);
  });
};

/**
 * list products by search
 * show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkboxes and radio buttons
 * we will make api calls and show the products to users based on what they want
 */
exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1]
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'products not found'
        });
      }
      res.json({
        size: data.length,
        data
      });
    });
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};
