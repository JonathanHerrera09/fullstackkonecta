const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Employee = require('./Employee');

const Request = sequelize.define('Request', {
  codigo: { type: DataTypes.STRING, allowNull: false },
  resumen: { type: DataTypes.TEXT, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
});

Request.belongsTo(Employee, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
Employee.hasMany(Request, { foreignKey: 'employeeId' });

module.exports = Request;
