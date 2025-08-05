const db = require('../config/db');

const findOrCreateCrypto = async (id, symbol, name, slug) => {
  const [existing] = await db.promise().query(
    `SELECT id FROM cryptocurrencies WHERE id = ?`,
    [id]
  );

  if (existing.length === 0) {
    await db.promise().query(
      `INSERT INTO cryptocurrencies (id, symbol, name, slug) VALUES (?, ?, ?, ?)`,
      [id, symbol, name, slug]
    );
  }
};

module.exports = { findOrCreateCrypto };
