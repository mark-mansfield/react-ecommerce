const express = require('express');
const router = express.Router();

const { create, productById, read, remove, update, list } = require('../controllers/product');
const { requireSignIn, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.put('/product/:productId/:userId', requireSignIn, isAdmin, isAuth, update);
router.get('/product/:productId', read);
router.delete('/product/:productId/:userId', requireSignIn, isAdmin, isAuth, remove);
router.post('/product/create/:userId', requireSignIn, isAdmin, isAuth, create);

router.get('/products', list);
router.param('userId', userById);
router.param('productId', productById);
module.exports = router;
