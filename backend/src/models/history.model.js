const db = require('../config/db');

const normalizeDecimal = (val) => {
  return String(val).replace(/\.?0+$/, '');
};

const savePriceHistory = async (
  cryptocurrency_id,
  price,
  volume_24h,
  percent_change_1h,
  percent_change_24h,
  percent_change_7d,
  timestamp
) => {

  const [lastRows] = await db.promise().query(
    `SELECT price, volume_24h, percent_change_1h, percent_change_24h, percent_change_7d
     FROM price_history 
     WHERE cryptocurrency_id = ?
     ORDER BY timestamp DESC
     LIMIT 1`,
    [cryptocurrency_id]
  );

  if (lastRows.length > 0) {
    const last = lastRows[0];

    const samePrice = normalizeDecimal(last.price) === normalizeDecimal(price);
    const sameVolume = normalizeDecimal(last.volume_24h) === normalizeDecimal(volume_24h);
    const same1h = normalizeDecimal(last.percent_change_1h) === normalizeDecimal(percent_change_1h);
    const same24h = normalizeDecimal(last.percent_change_24h) === normalizeDecimal(percent_change_24h);
    const same7d = normalizeDecimal(last.percent_change_7d) === normalizeDecimal(percent_change_7d);

    if (samePrice && sameVolume && same1h && same24h && same7d) {
      return;
    }
  } else {
    console.log(`[📭] No hay registros anteriores. Se guardará por primera vez`);
  }

  const query = `
    INSERT INTO price_history 
    (cryptocurrency_id, price, volume_24h, percent_change_1h, percent_change_24h, percent_change_7d, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  await db.promise().query(query, [
    cryptocurrency_id,
    price,
    volume_24h,
    percent_change_1h,
    percent_change_24h,
    percent_change_7d,
    timestamp
  ]);

};

const getPriceHistoryBySymbol = async (symbol) => {
  const [cryptoRows] = await db.promise().query(
    `SELECT id FROM cryptocurrencies WHERE symbol = ? LIMIT 1`,
    [symbol]
  );

  if (cryptoRows.length === 0) return null;

  const cryptoId = cryptoRows[0].id;

  const [historyRows] = await db.promise().query(
    `SELECT price, volume_24h, percent_change_1h, percent_change_24h, percent_change_7d, timestamp
     FROM price_history 
     WHERE cryptocurrency_id = ? AND timestamp >= NOW() - INTERVAL 1 HOUR
     ORDER BY timestamp ASC`,
    [cryptoId]
  );

  return historyRows;
};

module.exports = { 
    savePriceHistory,
    getPriceHistoryBySymbol
 };
