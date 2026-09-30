import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { signToken } from "../utils/token.js";

export const authRouter = Router();

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
}

authRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name: String(name).trim(),
      email: String(email).toLowerCase(),
      passwordHash,
    });
    const token = signToken(user._id);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not create account" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const match = await bcrypt.compare(String(password), user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = signToken(user._id);
    res.json({ token, user: publicUser(user) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not sign in" });
  }
});

authRouter.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(publicUser(user));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not load profile" });
  }
});
