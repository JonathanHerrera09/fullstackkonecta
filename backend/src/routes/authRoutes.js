const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', [
  body('username').trim().escape(),
  body('password').isLength({ min: 6 }).escape()
], authController.register);

router.post('/login', [
  body('username').trim().escape(),
  body('password').notEmpty().escape(),
], authController.login);

module.exports = router;
