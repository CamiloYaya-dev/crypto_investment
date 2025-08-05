require('dotenv').config();

const env = {
  PORT: process.env.PORT || 3001,
  CMC_API_KEY: process.env.CMC_API_KEY,

  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || '3306',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'crypto_investment',
};

module.exports = env;