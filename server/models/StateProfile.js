const mongoose = require('mongoose');

const StateProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    soilType: {
        type: String,
        required: true // e.g., "Sandy Loam", "Black Soil"
    },
    avgTemp: {
        type: Number,
        required: true // Degrees Celsius
    },
    avgMoisture: {
        type: Number,
        required: true // Percentage
    },
    avgHumidity: {
        type: Number,
        required: true // Percentage
    },
    // NPK Values (mg/kg or appropriate unit)
    nitrogen: {
        type: Number,
        required: true
    },
    phosphorus: {
        type: Number,
        required: true
    },
    potassium: {
        type: Number,
        required: true
    },
    ph: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('StateProfile', StateProfileSchema);
