const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/utils/persistJob', () => ({
  runPersistenceJob: jest.fn(),
}));

describe('App', () => {
  it('debería responder en la ruta base /api/cryptos', async () => {
    const response = await request(app).get('/api/cryptos');
    expect(response.status).not.toBe(404);
  });

  it('debería tener CORS habilitado', async () => {
    const response = await request(app).get('/api/cryptos');
    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  it('debería aceptar JSON', async () => {
    const response = await request(app)
        .get('/api/cryptos/history/BTC');

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
  });
});
