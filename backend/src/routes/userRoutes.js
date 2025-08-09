const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const role = require('../middleware/roles');
const userCtrl = require('../controllers/userController');

const router = express.Router();

router.post('/', auth, role('admin'), [
  body('username').trim().escape(),
  body('password').isLength({ min: 6 }).escape(),
  body('role').isIn(['admin','employee'])
], userCtrl.createUser);

router.get('/', auth, role('admin'), userCtrl.getUsers);
router.get('/:id', auth, role('admin'), userCtrl.getUserById);
router.put('/:id', auth, role('admin'), userCtrl.updateUser);
router.delete('/:id', auth, role('admin'), userCtrl.deleteUser);

module.exports = router;
