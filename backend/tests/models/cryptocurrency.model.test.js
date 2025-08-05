const db = require('../../src/config/db');
const { findOrCreateCrypto } = require('../../src/models/cryptocurrency.model');

jest.mock('../../src/config/db', () => ({
  promise: jest.fn().mockReturnThis(),
  query: jest.fn()
}));

describe('Cryptocurrency Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('no debería insertar si la cripto ya existe', async () => {
    db.query.mockResolvedValueOnce([[{ id: 1 }]]); // Ya existe

    await findOrCreateCrypto(1, 'BTC', 'Bitcoin', 'bitcoin');

    expect(db.query).toHaveBeenCalledTimes(1); // Solo SELECT
    expect(db.query).toHaveBeenCalledWith(
      `SELECT id FROM cryptocurrencies WHERE id = ?`,
      [1]
    );
  });

  it('debería insertar si la cripto no existe', async () => {
    db.query
      .mockResolvedValueOnce([[]]) // No existe
      .mockResolvedValueOnce([{}]); // Insert mock

    await findOrCreateCrypto(2, 'ETH', 'Ethereum', 'ethereum');

    expect(db.query).toHaveBeenCalledTimes(2);
    expect(db.query).toHaveBeenCalledWith(
      `SELECT id FROM cryptocurrencies WHERE id = ?`,
      [2]
    );
    expect(db.query).toHaveBeenCalledWith(
      `INSERT INTO cryptocurrencies (id, symbol, name, slug) VALUES (?, ?, ?, ?)`,
      [2, 'ETH', 'Ethereum', 'ethereum']
    );
  });
});
