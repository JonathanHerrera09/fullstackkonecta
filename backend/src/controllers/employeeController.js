const { validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const { Op } = require('sequelize');

exports.createEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const employee = await Employee.create(req.body);
  res.json({ msg: 'Empleado creado', employee });
};

exports.getEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const where = search
      ? { name: { [Op.like]: `%${search}%` } }
      : {};

    const { count, rows } = await Employee.findAndCountAll({
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
    res.status(500).json({ msg: 'Error al obtener empleados' });
  }
};

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  await Employee.update(req.body, { where: { id } });
  res.json({ msg: 'Empleado actualizado' });
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  await Employee.destroy({ where: { id } });
  res.json({ msg: 'Empleado eliminado' });
};
exports.getEmployeeList = async (req, res) => {
  const empleados = await Employee.findAll({ attributes: ['id', 'name'] });
  res.json(empleados);
};