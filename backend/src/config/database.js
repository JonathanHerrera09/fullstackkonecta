const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  });

(async () => {
  try {
    await sequelize.authenticate();
    console.log(' Conexión establecida');
    await sequelize.sync({ alter: true });
    console.log(' Tablas sincronizadas');
  } catch (error) {
    console.error(' Error en la conexión DB:', error);
  }
})();

module.exports = sequelize;
