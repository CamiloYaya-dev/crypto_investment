const express = require('express');
const cors = require('cors');

const cryptoRoutes = require('./routes/crypto.routes');
const { runPersistenceJob } = require('./utils/persistJob');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/cryptos', cryptoRoutes);

setInterval(runPersistenceJob, 15 * 1000);

module.exports = app;
