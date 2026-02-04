const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  moisture: {
    type: Number,
    required: true
  },
  ph: {
    type: Number,
    required: true
  },
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
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  cropType: {
    type: String,
    enum: ['Tomato', 'Rice', 'Bell Pepper'],
    required: true
  },
  soilType: {
    type: String,
    enum: ['Sandy', 'Clay', 'Loam'],
    required: true
  },
  recommendation: {
    type: String,
    default: 'No Action Required'
  }
});

module.exports = mongoose.model('Reading', ReadingSchema);
