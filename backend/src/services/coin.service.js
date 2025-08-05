const axios = require('axios');
const env = require('../config/env');

const API_KEY = env.CMC_API_KEY;

const getCryptoData = async (symbol) => {
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`;
  const headers = {
    'X-CMC_PRO_API_KEY': API_KEY
  };
  const response = await axios.get(url, { headers });
  return response.data;
};

module.exports = { getCryptoData };
