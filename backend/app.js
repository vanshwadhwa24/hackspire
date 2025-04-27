const express = require('express');
const cors = require('cors');
const path = require('path');
const sosRoute = require('./routes/sosRoute');
const authRoutes = require('./routes/authRoute');

require('dotenv').config();

const app = express();

// Middleware (ALWAYS first)
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sos', sosRoute);

// Get Google Maps API Key
app.get('/api/google-maps-key', (req, res) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key not found. Check your .env file.' });
    }

    res.json({ apiKey });
});

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Catch-all for invalid routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
