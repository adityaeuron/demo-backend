const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const calculatorRoutes = require('./routes/calculator');
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

// Middleware
app.use(limiter);
app.use(express.json());

// Calculator routes
app.use('/api/calculator', calculatorRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Demo Backend API',
        version: '1.1.0'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
