import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { authRouter } from "./routes/auth.js";

// Load variables from .env into process.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

function checkEnv() {
  const errors = [];

  if (!process.env.MONGO_URI || !String(process.env.MONGO_URI).trim()) {
    errors.push('  • MONGO_URI is missing. Open backend/.env and paste your MongoDB Atlas connection string.');
  }

  if (!process.env.JWT_SECRET || !String(process.env.JWT_SECRET).trim()) {
    errors.push('  • JWT_SECRET is missing. Add a long random string to backend/.env (used to sign login tokens).');
  }

  if (errors.length > 0) {
    console.error("\n[!] Fix your .env file before starting the server:\n");
    console.error(errors.join("\n"));
    console.error("\n  Copy .env.example to .env if you have not created it yet.\n");
    process.exit(1);
  }
}

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({
    ok: true,
    message: "CareerBridge API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.use("/api/auth", authRouter);

async function start() {
  checkEnv();

  const mongoUri = String(process.env.MONGO_URI).trim();

  try {
    console.log("[...] Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("[OK] MongoDB connected successfully.\n");
  } catch (err) {
    console.error("\n[!] Could not connect to MongoDB.\n");
    console.error("Error message:", err.message || err);
    console.error("\nCommon fixes:");
    console.error("  • Check MONGO_URI in .env (no extra spaces or quotes).");
    console.error("  • In Atlas: Network Access → allow your IP (or 0.0.0.0/0 for testing).");
    console.error("  • Confirm database user name & password in the connection string.");
    console.error("  • Replace <password> with your real password (URL-encoded if it has special characters).\n");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`[OK] Server running at http://localhost:${PORT}`);
  });
}

start();
