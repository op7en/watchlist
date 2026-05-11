import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { config } from "../config/env";

const router = Router();

const isValidEmail = (v: unknown): v is string =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const isValidPassword = (v: unknown): v is string =>
  typeof v === "string" && v.length >= 6;

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as Record<string, unknown>;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (!isValidPassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 12);
    await new User({ email, password: hashed }).save();

    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error("[register]", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as Record<string, unknown>;

    if (!isValidEmail(email) || !isValidPassword(password)) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token, email: user.email });
  } catch (err) {
    console.error("[login]", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
