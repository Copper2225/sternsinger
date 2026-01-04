import { config } from "dotenv";
import express from "express";
import cors from "cors";

import { WebSocketServer } from "ws";

config();

const app = express();
app.use(cors());
app.use(express.json());

let districtValues = [];
const log = [];

// Use the environment variable or default to 3000 if not set
const PORT = process.env.PORT || 3000;

const BACKEND_SERVER_URL =
  process.env.BACKEND_SERVER_URL || `http://localhost:${PORT}`;

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
wss.on("connection", (ws) => {
  console.log("Client connected");

  // Send the current district values to the new client
  ws.send(JSON.stringify({ type: "districtUpdate", districtValues }));

  // Handle WebSocket messages
  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      if (message.type === "ping") {
        ws.send(JSON.stringify({ type: "pong" }));
      }
    } catch (e) {
      console.log(e);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Endpoint to get all district values
app.get("/districts", (req, res) => {
  if (districtValues.length === 0) {
    res.json(null);
  } else {
    res.json(districtValues);
  }
});

// Endpoint to update a specific district's value
app.post("/district", (req, res) => {
  const { index, value } = req.body;

  if (typeof index !== "number") {
    return res.status(400).json({ error: "Invalid index or value" });
  }

  // Update or add the value for the specified district
  districtValues[index] = value;

  // Log the action
  const timestamp = new Date().toISOString();
  log.push({ timestamp, action: `District ${value.name} updated`, value });

  // Broadcast the updated district values
  broadcast({ type: "districtUpdate", districtValues });

  res.json({ success: true, districtValues });
});

app.post("/districts", (req, res) => {
  const { value } = req.body;

  // Update or add the value for the specified district
  districtValues = value;

  // Log the action
  const timestamp = new Date().toISOString();
  log.push({ timestamp, action: `Districts updated`, value });

  // Broadcast the updated district values
  broadcast({ type: "districtUpdate", districtValues });

  res.json({ success: true, districtValues });
});

// Endpoint to get the log
app.get("/log", (req, res) => {
  res.json(log);
});
