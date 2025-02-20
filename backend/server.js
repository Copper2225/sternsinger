require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');

const app = express();
app.use(cors());
app.use(express.json());

let districtValues = [];
let log = [];

// Use the environment variable or default to 3000 if not set
const PORT = process.env.PORT || 3000;

const BACKEND_SERVER_URL = process.env.BACKEND_SERVER_URL || `http://localhost:${PORT}`;

const server = app.listen(PORT, () => {
    console.log(`API server running at ${BACKEND_SERVER_URL}`);
});

const wss = new WebSocketServer({ server });

const broadcast = (message) => {
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send the current district values to the new client
    ws.send(JSON.stringify({ type: 'districtUpdate', districtValues }));

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Endpoint to get all district values
app.get('/api/districts', (req, res) => {
    if (districtValues.length === 0) {
        res.json(null);
    } else {
        res.json(districtValues);
    }
});

// Endpoint to update a specific district's value
app.post('/api/district', (req, res) => {
    const { index, value } = req.body;

    if (typeof index !== 'number') {
        return res.status(400).json({ error: 'Invalid index or value' });
    }

    // Update or add the value for the specified district
    districtValues[index] = value;

    // Log the action
    const timestamp = new Date().toISOString();
    log.push({ timestamp, action: `District ${value.name} updated`, value });

    // Broadcast the updated district values
    broadcast({ type: 'districtUpdate', districtValues });

    res.json({ success: true, districtValues });
});

app.post('/api/districts', (req, res) => {
    const { value } = req.body;

    // Update or add the value for the specified district
    districtValues = value;

    // Log the action
    const timestamp = new Date().toISOString();
    log.push({ timestamp, action: `Districts updated`, value });

    // Broadcast the updated district values
    broadcast({ type: 'districtUpdate', districtValues });

    res.json({ success: true, districtValues });
});

// Endpoint to get the log
app.get('/api/log', (req, res) => {
    res.json(log);
});
