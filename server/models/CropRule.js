const mongoose = require('mongoose');

const CropRuleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['Primary', 'Secondary'],
        default: 'Primary'
    },
    soilTypes: [{
        type: String // List of soil types this crop thrives in
    }],
    minTemp: Number,
    maxTemp: Number,
    minPh: Number,
    maxPh: Number,
    minMoisture: Number,
    fertilizers: [{
        type: String // Recommended fertilizers
    }]
});

module.exports = mongoose.model('CropRule', CropRuleSchema);
