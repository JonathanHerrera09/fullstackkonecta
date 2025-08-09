const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Employee = require('../models/Employee');
require('dotenv').config();

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const user = await User.create(req.body);
  res.json({ msg: 'Usuario registrado', user });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: 'Contraseña incorrecta' });

  let employeeId = null;
  if (user.role === 'employee') {
    const employee = await Employee.findOne({ where: { userId: user.id } });
    employeeId = employee?.id || null;
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({
    msg: 'Login exitoso',
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      employeeId:employeeId,
    }
  });
};
