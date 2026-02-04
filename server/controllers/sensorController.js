const Reading = require('../models/Reading');
const { getRecommendation } = require('../utils/decisionEngine');

// ingestData: Receives raw sensor data, processing it, and saving.
exports.ingestData = async (req, res) => {
    try {
        const { moisture, ph, nitrogen, phosphorus, potassium, temperature, humidity, cropType, soilType } = req.body;

        // Run Decision Engine
        const recommendation = getRecommendation({
            moisture, nitrogen, phosphorus, potassium, cropType, soilType
        });

        const newReading = new Reading({
            moisture, ph, nitrogen, phosphorus, potassium, temperature, humidity, cropType, soilType, recommendation
        });

        await newReading.save();

        res.status(201).json({ success: true, data: newReading });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// getHistory: Get all readings (optional: limit/filter)
exports.getHistory = async (req, res) => {
    try {
        const readings = await Reading.find().sort({ timestamp: -1 }).limit(50);
        res.status(200).json({ success: true, count: readings.length, data: readings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// getStats: Get simple stats for dashboard
exports.getStats = async (req, res) => {
    try {
        const latest = await Reading.findOne().sort({ timestamp: -1 });
        // Can add aggregation here for averages if needed
        res.status(200).json({ success: true, latest });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
