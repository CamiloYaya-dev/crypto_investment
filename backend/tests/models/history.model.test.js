const db = require('../../src/config/db');
const { savePriceHistory, getPriceHistoryBySymbol } = require('../../src/models/history.model');

jest.mock('../../src/config/db', () => ({
  promise: jest.fn().mockReturnThis(),
  query: jest.fn()
}));

describe('History Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPriceHistoryBySymbol', () => {
    it('debería retornar null si no encuentra la cripto', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const result = await getPriceHistoryBySymbol('ABC');
      expect(result).toBeNull();
      expect(db.query).toHaveBeenCalledWith(
        `SELECT id FROM cryptocurrencies WHERE symbol = ? LIMIT 1`,
        ['ABC']
      );
    });

    it('debería retornar historial si encuentra la cripto', async () => {
      db.query
        .mockResolvedValueOnce([[{ id: 123 }]])
        .mockResolvedValueOnce([[{ price: 1, timestamp: '2025-08-05T00:00:00Z' }]]);

      const result = await getPriceHistoryBySymbol('BTC');
      expect(result).toEqual([{ price: 1, timestamp: '2025-08-05T00:00:00Z' }]);
    });
  });

  describe('savePriceHistory', () => {
    const mockParams = [1, 100, 200, 1, 2, 3, new Date()];

    it('no debería insertar si los valores son iguales a los últimos', async () => {
      db.query.mockResolvedValueOnce([[{
        price: "100",
        volume_24h: "200",
        percent_change_1h: "1",
        percent_change_24h: "2",
        percent_change_7d: "3"
      }]]);

      await savePriceHistory(...mockParams);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('debería insertar si los valores son distintos', async () => {
      db.query
        .mockResolvedValueOnce([[{
          price: "99",
          volume_24h: "199",
          percent_change_1h: "0.9",
          percent_change_24h: "1.9",
          percent_change_7d: "2.9"
        }]])
        .mockResolvedValueOnce([{}]);

      await savePriceHistory(...mockParams);
      expect(db.query).toHaveBeenCalledTimes(2);
    });

    it('debería insertar si no hay registros anteriores', async () => {
      db.query
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([{}]);

      await savePriceHistory(...mockParams);
      expect(db.query).toHaveBeenCalledTimes(2);
    });
  });
});
