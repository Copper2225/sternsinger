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
let districtSecrets = [];

const forceAllow = true;

const log = [];

// Use the environment variable or default to 3000 if not set
const PORT = process.env.PORT || 3000;

const BACKEND_SERVER_URL =
  process.env.BACKEND_SERVER_URL || `http://localhost:${PORT}`;

const server = app.listen(PORT, () => {
  console.log(`API server running at ${BACKEND_SERVER_URL}`);
});

const generateDistrictPasscode = () =>
    crypto.randomBytes(3).toString("hex").slice(0, 6);

const hashPasscode = (passcode) =>
    crypto.createHash("sha256").update(passcode).digest();

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


app.post("/district", (req, res) => {
  const districtIndex = Number(req.signedCookies.district_session);
  const { index, value } = req.body;

  if (districtIndex !== index && req.signedCookies.admin_session !== 'authorized' && !forceAllow) {
    return res.sendStatus(403);
  }

  if (typeof index !== "number") {
    return res.status(400).json({ error: "Invalid index" });
  }

  districtValues[index] = value;

  const timestamp = new Date().toISOString();
  log.push({
    timestamp,
    action: `District ${value.name} updated`,
  });

  broadcast({ type: "districtUpdate", districtValues });

  res.json({ success: true });
});


app.post("/districts", (req, res) => {
  if (req.signedCookies.admin_session !== 'authorized') {
    return res.sendStatus(401);
  }

  const { value } = req.body;
  if (!Array.isArray(value)) {
    return res.status(400).json({ error: "Invalid districts value" });
  }

  if (value.length !== districtValues.length) {
    districtSecrets = value.map(() => {
      const pass = generateDistrictPasscode();
      return { plain: pass, hash: hashPasscode(pass) };
    });
  }

  districtValues = value;

  const timestamp = new Date().toISOString();
  log.push({ timestamp, action: "Districts updated" });

  broadcast({ type: "districtUpdate", districtValues });

  res.json({ success: true, districtValues });
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

app.post("/district-auth", (req, res) => {
  const { index, passcode } = req.body;

  if (typeof index !== "number" || !passcode) {
    return res.sendStatus(400);
  }

  const secret = districtSecrets[index];
  if (!secret) {
    return res.sendStatus(401);
  }

  if (passcode === secret.plain) {
    res.cookie("district_session", String(index), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      signed: true,
      maxAge: 12 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  }

  res.sendStatus(401);
});


app.post("/dist-check-auth", (req, res) => {
  const districtIndex = Number(req.signedCookies.district_session);
  const { index } = req.body;

  if (districtIndex !== index && !forceAllow) {
    res.clearCookie("district_session");
    return res.sendStatus(403);
  } else  {
    res.sendStatus(200);
  }
});

app.get("/district-passcodes", (req, res) => {
  if (req.signedCookies.admin_session !== 'authorized') {
    return res.sendStatus(401);
  }

  const passcodes = districtSecrets.map((s) => s.plain);

  res.json({ success: true, passcodes });
});

