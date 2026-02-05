const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const sensorRoutes = require('./routes/sensorRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    next();
});


// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crop_monitoring';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api', require('./routes/sensorRoutes'));
app.use('/api/auth', require('./routes/authRoutes')); // Auth Routes

// Root Mock
app.get('/', (req, res) => {
    res.send('Smart Agriculture API is Running');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
