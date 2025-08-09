const { validationResult } = require('express-validator');
const User = require('../models/User');
const Employee = require('../models/Employee');
const { Op } = require('sequelize');

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, password, role, name, salary, hireDate } = req.body;

  const user = await User.create({ username, password, role });

  if (role === 'employee') {
    await Employee.create({
      name,
      salary,
      hireDate,
      userId: user.id,
    });
  }

  res.json({ msg: 'Usuario creado', user });
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [Employee]
    });

    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener el usuario' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const where = search
      ? {
          [Op.or]: [
            { username: { [Op.like]: `%${search}%` } },
            { role: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener usuarios' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  await User.update(req.body, { where: { id } });
  res.json({ msg: 'Usuario actualizado' });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  res.json({ msg: 'Usuario eliminado' });
};
