const StateProfile = require('../models/StateProfile');
const CropRule = require('../models/CropRule');

// 1. Get all available states
exports.getStates = async (req, res) => {
    try {
        const states = await StateProfile.find().select('name');
        res.json({ success: true, count: states.length, data: states });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// 2. Get specific state profile (Average Conditions)
exports.getStateProfile = async (req, res) => {
    try {
        const profile = await StateProfile.findOne({ name: req.params.stateName });
        if (!profile) {
            return res.status(404).json({ success: false, msg: 'State profile not found' });
        }
        res.json({ success: true, data: profile });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// 3. Recommendation Engine Logic
exports.getRecommendations = async (req, res) => {
    try {
        const { temp, ph, moisture, soilType } = req.body;

        // Find matching crops based on rules
        const crops = await CropRule.find({
            // 1. Soil Match (exact or similar)
            soilTypes: soilType, // Mongoose handles array inclusion check

            // 2. Temperature Match (Range)
            minTemp: { $lte: temp },
            maxTemp: { $gte: temp },

            // 3. pH Match (Range)
            minPh: { $lte: ph },
            maxPh: { $gte: ph },
            /*
             * Note: Moisture is less strict as it can be irrigation controlled,
             * but we can use it to prioritize or warn.
             */
        });

        // Separate into Primary and Secondary
        const primary = [];
        const secondary = [];

        crops.forEach(crop => {
            // Logic: Is moisture suitable?
            if (moisture >= crop.minMoisture) {
                if (crop.type === 'Primary') primary.push(crop);
                else secondary.push(crop);
            } else {
                // If moisture is low, it's risky but possible with irrigation
                // We could add a "Needs Irrigation" flag here
                secondary.push({ ...crop.toObject(), note: "Needs Irrigation" });
            }
        });

        res.json({
            success: true,
            matches: crops.length,
            recommendations: {
                primary,
                secondary
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};
