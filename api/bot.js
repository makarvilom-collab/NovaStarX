const express = require('express');

// Import bot
const bot = require('./bot');

const app = express();

// Bot webhook
app.use('/api/webhook', bot);

// Health check  
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', service: 'NovaStarsX Bot API' });
});

// Default route
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

module.exports = app;