"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs")); // use for i
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.default({ email, password: hashed });
        await user.save();
        res.status(201).json({ message: "User created" });
    }
    catch (err) {
        res.status(500).json(err);
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User not found" });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid password" });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
        res.json({ token, email: user.email });
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.default = router;
