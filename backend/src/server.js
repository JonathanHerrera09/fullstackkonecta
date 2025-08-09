const app = require('./app');
require('dotenv').config();

const User = require('./models/User');
const sequelize = require('./config/database');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 4000;

async function crearAdminPorDefecto() {
  const existe = await User.findOne({ where: { username: 'admin' } });
  if (!existe) {
    await User.create({
      username: 'admin',
      password: '123456',
      role: 'admin',
    });
    console.log(' Usuario admin creado: admin / 123456');
  } else {
    console.log('ℹ El usuario admin ya existe');
  }
}

async function iniciarServidor() {
  try {
    console.log('Sincronizando base de datos...');
    await sequelize.sync({ alter: true });

    console.log(' Base de datos lista');
    await crearAdminPorDefecto();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
  }
}

iniciarServidor();
