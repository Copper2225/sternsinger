import { config } from "dotenv";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { WebSocketServer } from "ws";

config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser(process.env.SECRET));

let districtValues = [];
const log = [];

// Use the environment variable or default to 3000 if not set
const PORT = process.env.PORT || 3000;

const BACKEND_SERVER_URL =
  process.env.BACKEND_SERVER_URL || `http://localhost:${PORT}`;

const server = app.listen(PORT, () => {
  console.log(`API server running at ${BACKEND_SERVER_URL}`);
});

let tries = 0;

const timer = setInterval(() => {
  if (tries > 0) {
    tries--;
  } else {
    clearInterval(timer); // Stops the timer when it reaches zero
  }
}, 60000);

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

  districtValues = value;

  const timestamp = new Date().toISOString();
  log.push({ timestamp, action: `Districts updated`, value });

  broadcast({ type: "districtUpdate", districtValues });

  res.json({ success: true, districtValues });
});

app.get("/log", (req, res) => {
  res.json(log);
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Zu viele Login-Versuche, versuche es in 15 Minuten erneut."
});

app.post("/pass", loginLimiter, (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ success: false });

  const inputHash = crypto.createHash('sha256').update(password).digest();
  const storedHash = Buffer.from(process.env.ADMIN_PASSWORD, 'hex');

  if (crypto.timingSafeEqual(inputHash, storedHash)) {
    res.cookie('admin_session', 'authorized', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      signed: true,
      maxAge: 60 * 60 * 1000 * 12,
    });

    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false });
  }
});

app.get("/check-auth", (req, res) => {
  if (req.signedCookies.admin_session === 'authorized') {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});