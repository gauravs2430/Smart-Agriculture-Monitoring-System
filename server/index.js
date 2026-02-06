const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const sensorRoutes = require('./routes/sensorRoutes');

dotenv.config();

const app = express();

const cookieParser = require('cookie-parser');

// Middleware
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

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
app.use('/api/data', require('./routes/dataRoutes')); // Data & Recommendation Routes

// Root Mock
app.get('/', (req, res) => {
    res.send('Smart Agriculture API is Running');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
