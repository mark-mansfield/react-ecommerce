const express = require('express');
const router = express.Router();
const { requireSignIn, isAuth, isAdmin } = require('../controllers/auth');
const { userById, addOrderToUserHistory } = require('../controllers/user');
const { create, listOrders, getStatusValues, orderId, updateOrderStatus } = require('../controllers/order');
const { decreaseQuantity } = require('../controllers/product');

router.post('/order/create/:userId', requireSignIn, isAuth, addOrderToUserHistory, decreaseQuantity, create);
router.get('/orders/list/:userId', requireSignIn, isAuth, isAdmin, listOrders);
router.get('/orders/status/values/:userId', requireSignIn, isAuth, isAdmin, getStatusValues);
router.put('/orders/:orderId/status/:userId', requireSignIn, isAuth, isAdmin, updateOrderStatus);

router.param('userId', orderId);
router.param('userId', userById);

module.exports = router;
