const express = require('express');
const cors = require('cors');

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route — confirms server is up
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Water Disease Risk Prediction API is running',
    timestamp: new Date().toISOString(),
  });
});

// Route mounting will go here as we build each feature
app.use('/api', require('./routes/index'));

// 404 handler — must come after all routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler — must be last
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

module.exports = app;