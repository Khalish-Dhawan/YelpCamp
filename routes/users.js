const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');

router.get('/register', users.registerForm);

router.post('/register', users.registerUser);

router.get('/login', users.loginForm)

router.get('/logout', users.logout)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser);

module.exports = router;