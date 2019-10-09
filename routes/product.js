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
  listCategories
} = require('../controllers/product');
const { requireSignIn, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.put('/product/:productId/:userId', requireSignIn, isAdmin, isAuth, update);
router.get('/product/:productId', read);
router.delete('/product/:productId/:userId', requireSignIn, isAdmin, isAuth, remove);
router.post('/product/create/:userId', requireSignIn, isAdmin, isAuth, create);

router.get('/products', list);
router.get('/products/related/:productId', listRelated);
router.get('/products/categories/', listCategories);
router.param('userId', userById);
router.param('productId', productById);
module.exports = router;
