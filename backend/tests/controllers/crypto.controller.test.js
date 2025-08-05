const { fetchCrypto, getCryptoHistory } = require('../../src/controllers/crypto.controller');
const coinService = require('../../src/services/coin.service');
const historyModel = require('../../src/models/history.model');

jest.mock('../../src/services/coin.service');
jest.mock('../../src/models/history.model');
jest.mock('../../src/config/db', () => ({
  query: jest.fn(),
  end: jest.fn(),
}));

describe('Crypto Controller', () => {
  describe('fetchCrypto', () => {
    it('debería retornar datos correctamente', async () => {
      const mockData = { BTC: { name: 'Bitcoin' } };
      coinService.getCryptoData.mockResolvedValue(mockData);

      const req = { query: { symbol: 'BTC' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await fetchCrypto(req, res);

      expect(coinService.getCryptoData).toHaveBeenCalledWith('BTC');
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('debería manejar errores', async () => {
      coinService.getCryptoData.mockRejectedValue(new Error('fail'));

      const req = { query: { symbol: 'BTC' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await fetchCrypto(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al obtener datos' });
    });
  });

  describe('getCryptoHistory', () => {
    it('debería retornar historial correctamente', async () => {
      const mockHistory = [{ price: 100, timestamp: '2025-08-05T00:00:00Z' }];
      historyModel.getPriceHistoryBySymbol.mockResolvedValue(mockHistory);

      const req = { params: { symbol: 'BTC' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await getCryptoHistory(req, res);

      expect(historyModel.getPriceHistoryBySymbol).toHaveBeenCalledWith('BTC');
      expect(res.json).toHaveBeenCalledWith(mockHistory);
    });

    it('debería retornar error 400 si no hay parámetro symbol', async () => {
      const req = { params: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await getCryptoHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Falta el parámetro symbol' });
    });

    it('debería retornar error 404 si no se encuentra historial', async () => {
      historyModel.getPriceHistoryBySymbol.mockResolvedValue([]);

      const req = { params: { symbol: 'ETH' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await getCryptoHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No se encontró historial para esta cripto' });
    });

    it('debería manejar errores internos', async () => {
      historyModel.getPriceHistoryBySymbol.mockRejectedValue(new Error('fail'));

      const req = { params: { symbol: 'ETH' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await getCryptoHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al obtener historial' });
    });
  });
});
