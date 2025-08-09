const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const role = require('../middleware/roles');
const reqCtrl = require('../controllers/requestController');

const router = express.Router();

router.post('/', auth, [
  body('description').trim().escape(),
  body('employeeId').isInt()
], reqCtrl.createRequest);

router.get('/', auth, reqCtrl.getRequests);
router.put('/:id', auth, role('admin'), reqCtrl.updateRequest);
router.delete('/:id', auth, role('admin'), reqCtrl.deleteRequest);

module.exports = router;
