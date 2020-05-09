const express = require('express');
const router = express.Router();

const {
  create,
  productById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listBySearch,
  listSearch,
  photo
} = require('../controllers/product');

const { requireSignIn, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

// CRUD routes
router.put('/product/:productId/:userId', requireSignIn, isAdmin, isAuth, update);
router.delete('/product/:productId/:userId', requireSignIn, isAdmin, isAuth, remove);
router.post('/product/create/:userId', requireSignIn, isAdmin, isAuth, create);

// list product routes
router.post('/products/by/search', listBySearch);
router.get('/product/:productId', read);
router.get('/products', list);
router.get('/products/search', listSearch);
router.get('/products/related/:productId', listRelated);

//  list products in category's
router.get('/products/categories/', listCategories);

// get product image
router.get('/products/photo/:productId', photo);

// middleware
router.param('userId', userById);
router.param('productId', productById);
module.exports = router;
