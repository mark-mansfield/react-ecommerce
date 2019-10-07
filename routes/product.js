const express = require('express');
const router = express.Router();

const { create, productById, read } = require('../controllers/product');
const { requireSignIn, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/product/:productId', read);
router.post('/product/create/:userId', requireSignIn, isAdmin, isAuth, create);

router.param('userId', userById);
router.param('productId', productById);
module.exports = router;
