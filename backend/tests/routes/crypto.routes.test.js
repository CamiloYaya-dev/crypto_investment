const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes/crypto.routes');

const app = express();
app.use(express.json());
app.use('/api/cryptos', routes);

describe('GET /api/cryptos/history/:symbol', () => {
  it('debe devolver status 200 y un array', async () => {
    const res = await request(app).get('/api/cryptos/history/BTC');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('debe manejar símbolos inválidos', async () => {
    const res = await request(app).get('/api/cryptos/history/INVALID');
    expect(res.statusCode).toBe(404);
  });
});
