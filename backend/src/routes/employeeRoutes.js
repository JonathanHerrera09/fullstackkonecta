const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const role = require('../middleware/roles');
const empCtrl = require('../controllers/employeeController');

const router = express.Router();

router.post('/', auth, role('admin'), [
  body('name').trim().escape(),
  body('position').trim().escape(),
  body('salary').isFloat()
], empCtrl.createEmployee);

router.get('/', auth, empCtrl.getEmployees);
router.put('/:id', auth, role('admin'), empCtrl.updateEmployee);
router.delete('/:id', auth, role('admin'), empCtrl.deleteEmployee);
router.get('/list', auth, role('admin'), empCtrl.getEmployeeList);

module.exports = router;
