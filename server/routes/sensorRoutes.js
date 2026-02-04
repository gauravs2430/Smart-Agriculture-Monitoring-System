const express = require('express');
const router = express.Router();
const { ingestData, getHistory, getStats } = require('../controllers/sensorController');

router.post('/readings', ingestData);
router.get('/readings', getHistory);
router.get('/stats', getStats);

module.exports = router;
