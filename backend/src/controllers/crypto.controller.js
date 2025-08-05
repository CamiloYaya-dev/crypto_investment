const { getCryptoData } = require('../services/coin.service');
const { getPriceHistoryBySymbol } = require('../models/history.model');

const fetchCrypto = async (req, res) => {
  try {
    const { symbol } = req.query;
    const response = await getCryptoData(symbol);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener datos' });
  }
};

const getCryptoHistory = async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({ error: 'Falta el parámetro symbol' });
    }

    const data = await getPriceHistoryBySymbol(symbol.toUpperCase());

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No se encontró historial para esta cripto' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error al obtener historial:', err);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};

module.exports = {
  fetchCrypto,
  getCryptoHistory,
};
