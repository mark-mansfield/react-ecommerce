const express = require('express');
const router = express.Router();
const { requireSignIn, isAuth } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { generateToken, processPayment } = require('../controllers/braintree');

router.get('/braintree/getToken/:userId', requireSignIn, isAuth, generateToken);
router.post('/braintree/payment/:userId', requireSignIn, isAuth, processPayment);
router.param('userId', userById);

module.exports = router;
