require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');

const app = express();
app.use(cors());
app.use(express.json());

let districtValues = []; // Store district values
let log = []; // Log of actions

// Use the environment variable or default to 3000 if not set
const PORT = process.env.PORT || 3000;

// Use the backend URL from the environment variables (default to local URL)
const BACKEND_SERVER_URL = process.env.BACKEND_SERVER_URL || `http://localhost:${PORT}`;

const server = app.listen(PORT, () => {
    console.log(`API server running at ${BACKEND_SERVER_URL}`);
});

// WebSocket server
const wss = new WebSocketServer({ server });

// Broadcast a message to all clients
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
    res.json(districtValues);
});

// Endpoint to update a specific district's value
app.post('/api/districts', (req, res) => {
    const { index, value } = req.body;

    if (typeof index !== 'number' || typeof value !== 'number') {
        return res.status(400).json({ error: 'Invalid index or value' });
    }

    // Update or add the value for the specified district
    districtValues[index] = value;

    // Log the action
    const timestamp = new Date().toISOString();
    log.push({ timestamp, action: `District ${index + 1} updated`, value });

    // Broadcast the updated district values
    broadcast({ type: 'districtUpdate', districtValues });

    res.json({ success: true, districtValues });
});

// Endpoint to get the log
app.get('/api/log', (req, res) => {
    res.json(log);
});
