"use strict";

var express = require('express');
var router = express.Router();
var passport = require('passport');
var catchAsync = require('../utils/catchAsync');
var _require = require('../middleware'),
  isLoggedIn = _require.isLoggedIn;
var _require2 = require('../middleware'),
  storeReturnTo = _require2.storeReturnTo;
var users = require('../controllers/users');
router.route('/register').get(users.renderRegister).post(catchAsync(users.register));
router.route('/login').get(users.renderLogin).post(storeReturnTo, passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/login'
}), users.login);
router.get('/logout', isLoggedIn, users.logout);
module.exports = router;