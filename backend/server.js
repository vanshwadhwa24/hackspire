const express = require('express');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // Correct .env path

// const app = express();
const app = require('./app'); 

// Middleware
app.use(express.json());
app.use(cors());

// Log every request
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// Test .env variable loading
console.log('Twilio SID from .env:', process.env.TWILIO_ACCOUNT_SID || 'Not loaded'); // Debugging .env

// Serve static files (optional: adjust if unnecessary)
app.use('/static', express.static(path.join(__dirname, '../frontend')));

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Generate heatmap dynamically
app.get('/generate-heatmap', (req, res) => {
  const scriptPath = path.join(__dirname, '../pythonscripts/generateheatmap.py');
  
  exec(`python ${scriptPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error('Error executing Python script:', err);
      res.status(500).send('Error generating heatmap');
      return;
    }
    if (stderr) {
      console.error('Python script stderr:', stderr);
    }
    res.send(stdout);
  });
});

// Geofencing API
app.post('/geofence', (req, res) => {
  const { userLat, userLng, geofenceLat, geofenceLng, radius } = req.body;

  if (!userLat || !userLng || !geofenceLat || !geofenceLng || !radius) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  // Calculate the distance between two points (Haversine formula)
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const earthRadius = 6371e3; // Earth's radius in meters

  const dLat = toRadians(geofenceLat - userLat);
  const dLng = toRadians(geofenceLng - userLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(userLat)) * Math.cos(toRadians(geofenceLat)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  // Check if within geofence
  const isWithinGeofence = distance <= radius;

  res.json({
    distance: distance.toFixed(2), // in meters
    isWithinGeofence,
    message: isWithinGeofence
      ? 'User is within the geofence.'
      : 'User is outside the geofence.',
  });
});

app.get('/test', (req, res) => {
  res.send('Server is up and running!');
});

app.get('/favicon.ico', (req, res) => res.status(204).end());


// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Error starting the server:', err);
});
