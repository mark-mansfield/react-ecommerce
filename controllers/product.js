const formidable = require('formidable');
const { errorHandler } = require('../helpers/dbErrorHandler');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');

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
