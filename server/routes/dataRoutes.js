const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Get list of supported states
router.get('/states', dataController.getStates);

// Get typical data for a state
router.get('/state/:stateName', dataController.getStateProfile);

// Get Recommendations based on input conditions
router.post('/recommend', dataController.getRecommendations);

module.exports = router;
