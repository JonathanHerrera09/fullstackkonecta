const { validationResult } = require('express-validator');
const Request = require('../models/Request');
const Employee = require('../models/Employee');
const { Op } = require('sequelize');

exports.createRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const request = await Request.create(req.body);
  res.json({ msg: 'Solicitud creada', request });
};

exports.getRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const where = {};

    if (req.user.role === 'employee') {
      where.employeeId = req.user.employeeId;
    } else if (search) {
      where.description = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await Request.findAndCountAll({
      where,
      include: { model: Employee, attributes: ['id', 'name'] },
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
    res.status(500).json({ msg: 'Error al obtener solicitudes' });
  }
};


exports.updateRequest = async (req, res) => {
  const { id } = req.params;
  await Request.update(req.body, { where: { id } });
  res.json({ msg: 'Solicitud actualizada' });
};

exports.deleteRequest = async (req, res) => {
  const { id } = req.params;
  await Request.destroy({ where: { id } });
  res.json({ msg: 'Solicitud eliminada' });
};
