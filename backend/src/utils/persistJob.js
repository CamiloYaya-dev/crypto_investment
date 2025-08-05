const { getCryptoData } = require('../services/coin.service');
const { findOrCreateCrypto } = require('../models/cryptocurrency.model');
const { savePriceHistory } = require('../models/history.model');

const symbols = ['BTC', 'ETH', 'SOL'];

const runPersistenceJob = async () => {
  console.log(`[i] Ejecutando persistencia de criptos…`);
  for (const symbol of symbols) {
    try {
      const res = await getCryptoData(symbol);
      const crypto = res.data[symbol];
      const id = crypto.id;
      const quote = crypto.quote.USD;

      await findOrCreateCrypto(id, crypto.symbol, crypto.name, crypto.slug);
      await savePriceHistory(
        id,
        quote.price,
        quote.volume_24h,
        quote.percent_change_1h,
        quote.percent_change_24h,
        quote.percent_change_7d,
        new Date()
      );
    } catch (err) {
      console.error(`[✗] Error guardando ${symbol}: ${err.message}`);
    }
  }
};

module.exports = { runPersistenceJob };
