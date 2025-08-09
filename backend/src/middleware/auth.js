const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

module.exports = async function(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(401).json({ msg: 'Usuario no válido' });

    req.user = { id: user.id, role: user.role };

    if (user.role === 'employee') {
      const emp = await Employee.findOne({ where: { userId: user.id } });
      if (emp) req.user.employeeId = emp.id;
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido' });
  }
};
