const axios = require('axios');
const { getCryptoData } = require('../../src/services/coin.service');

jest.mock('axios');

describe('Coin Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería retornar data correctamente desde CoinMarketCap API', async () => {
    const mockData = {
      data: {
        BTC: {
          id: 1,
          name: 'Bitcoin',
          symbol: 'BTC',
          quote: {
            USD: {
              price: 50000,
              volume_24h: 3000000
            }
          }
        }
      }
    };

    axios.get.mockResolvedValueOnce({ data: mockData });

    const result = await getCryptoData('BTC');

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('symbol=BTC'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-CMC_PRO_API_KEY': expect.any(String)
        })
      })
    );

    expect(result).toEqual(mockData);
  });

  it('debería lanzar error si la API falla', async () => {
    axios.get.mockRejectedValueOnce(new Error('API error'));

    await expect(getCryptoData('BTC')).rejects.toThrow('API error');
  });
});
