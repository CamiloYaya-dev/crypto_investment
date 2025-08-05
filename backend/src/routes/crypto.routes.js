const express = require('express');
const router = express.Router();
const { fetchCrypto, getCryptoHistory } = require('../controllers/crypto.controller');

router.get('/', fetchCrypto);
router.get('/history/:symbol', getCryptoHistory);

module.exports = router;
