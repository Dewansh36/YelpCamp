const User = require('../models/user');
const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const router = express.Router();
const users = require('../controller/users');

router.route('/register')
    .get(users.renderRegister)
    .post(users.Register);

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

module.exports = router;