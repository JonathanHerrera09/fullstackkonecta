const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Employee = sequelize.define('Employee', {
  name: { type: DataTypes.STRING, allowNull: false },
  salary: { type: DataTypes.FLOAT, allowNull: false },
  hireDate: { type: DataTypes.DATEONLY, allowNull: false }
});

Employee.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(Employee, { foreignKey: 'userId' });
Employee.associate = models => {
  Employee.belongsTo(models.User, { foreignKey: 'userId' });
};

module.exports = Employee;
