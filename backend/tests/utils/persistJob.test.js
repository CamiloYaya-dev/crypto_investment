const { runPersistenceJob } = require('../../src/utils/persistJob');
const coinService = require('../../src/services/coin.service');
const cryptoModel = require('../../src/models/cryptocurrency.model');
const historyModel = require('../../src/models/history.model');

jest.mock('../../src/services/coin.service');
jest.mock('../../src/models/cryptocurrency.model');
jest.mock('../../src/models/history.model');
jest.mock('../../src/config/db', () => {
  return {
    promise: () => ({
      query: jest.fn(), // evita ejecución real
    }),
  };
});


describe('runPersistenceJob', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería guardar correctamente las criptos sin errores', async () => {
    // Simular respuesta por cada símbolo
    coinService.getCryptoData
      .mockResolvedValueOnce({
        data: {
          BTC: {
            id: 1,
            symbol: 'BTC',
            name: 'Bitcoin',
            slug: 'bitcoin',
            quote: {
              USD: {
                price: 50000,
                volume_24h: 1000000,
                percent_change_1h: 1.5,
                percent_change_24h: 3.2,
                percent_change_7d: 5.7,
              },
            },
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          ETH: {
            id: 2,
            symbol: 'ETH',
            name: 'Ethereum',
            slug: 'ethereum',
            quote: {
              USD: {
                price: 3000,
                volume_24h: 500000,
                percent_change_1h: 0.8,
                percent_change_24h: 2.0,
                percent_change_7d: 4.1,
              },
            },
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          SOL: {
            id: 3,
            symbol: 'SOL',
            name: 'Solana',
            slug: 'solana',
            quote: {
              USD: {
                price: 100,
                volume_24h: 200000,
                percent_change_1h: 0.2,
                percent_change_24h: 1.3,
                percent_change_7d: 2.9,
              },
            },
          },
        },
      });

    cryptoModel.findOrCreateCrypto.mockResolvedValue();
    historyModel.savePriceHistory.mockResolvedValue();

    await runPersistenceJob();

    expect(coinService.getCryptoData).toHaveBeenCalledTimes(3);
    expect(cryptoModel.findOrCreateCrypto).toHaveBeenCalledTimes(3);
    expect(historyModel.savePriceHistory).toHaveBeenCalledTimes(3);
  });

  it('debería manejar errores si alguna cripto falla', async () => {
    const error = new Error('API failed');

    coinService.getCryptoData
      .mockResolvedValueOnce({
        data: {
          BTC: {
            id: 1,
            symbol: 'BTC',
            name: 'Bitcoin',
            slug: 'bitcoin',
            quote: {
              USD: {
                price: 50000,
                volume_24h: 1000000,
                percent_change_1h: 1.5,
                percent_change_24h: 3.2,
                percent_change_7d: 5.7,
              },
            },
          },
        },
      })
      .mockRejectedValueOnce(error) // ETH falla
      .mockResolvedValueOnce({
        data: {
          SOL: {
            id: 3,
            symbol: 'SOL',
            name: 'Solana',
            slug: 'solana',
            quote: {
              USD: {
                price: 100,
                volume_24h: 300000,
                percent_change_1h: 0.5,
                percent_change_24h: 2.3,
                percent_change_7d: 4.4,
              },
            },
          },
        },
      });

    cryptoModel.findOrCreateCrypto.mockResolvedValue();
    historyModel.savePriceHistory.mockResolvedValue();

    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await runPersistenceJob();

    expect(coinService.getCryptoData).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[✗] Error guardando ETH: API failed'));

    spy.mockRestore();
  });
});
