"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const env_1 = require("../config/env");
const router = (0, express_1.Router)();
const isValidEmail = (v) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPassword = (v) => typeof v === "string" && v.length >= 6;
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }
        if (!isValidPassword(password)) {
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters" });
        }
        const existing = await User_1.default.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "Email already registered" });
        }
        const hashed = await bcryptjs_1.default.hash(password, 12);
        await new User_1.default({ email, password: hashed }).save();
        res.status(201).json({ message: "User created" });
    }
    catch (err) {
        console.error("[register]", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!isValidEmail(email) || !isValidPassword(password)) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, env_1.config.JWT_SECRET, {
            expiresIn: "24h",
        });
        res.json({ token, email: user.email });
    }
    catch (err) {
        console.error("[login]", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = router;
