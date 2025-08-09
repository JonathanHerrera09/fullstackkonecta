const request = require('supertest');
const app = require('../app');

const sequelize = require('../../config/database');

beforeAll(async () => {
  await sequelize.sync({ force: false });
});

describe('Autenticación', () => {
  test('Login correcto con admin', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: '123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.username).toBe('admin');
  });

  test('Login incorrecto con credenciales malas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'incorrecta' });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toMatch(/credenciales/i);
  });
});
