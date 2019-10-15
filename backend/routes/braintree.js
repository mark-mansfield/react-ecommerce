const express = require('express');
const router = express.Router();
const { requireSignIn, isAuth } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { generateToken } = require('../controllers/braintree');

router.get('/braintree/getToken/:userId', requireSignIn, isAuth, generateToken);

router.param('userId', userById);

module.exports = router;
