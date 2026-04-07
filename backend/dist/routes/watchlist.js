"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const WatchlistItem_1 = __importDefault(require("../models/WatchlistItem"));
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.get("/", async (req, res) => {
    try {
        const items = await WatchlistItem_1.default.find({ userId: req.userId });
        res.json(items);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
router.patch("/:id/rating", async (req, res) => {
    try {
        const { rating } = req.body;
        const item = await WatchlistItem_1.default.findByIdAndUpdate(req.params.id, { rating }, { new: true });
        res.json(item);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
router.post("/", async (req, res) => {
    try {
        const { movieId, title, year, poster_path } = req.body;
        const newItem = new WatchlistItem_1.default({
            userId: req.userId,
            movieId,
            title,
            year,
            poster_path,
        });
        await newItem.save();
        res.status(201).json(newItem);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
router.delete("/:id", async (req, res) => {
    try {
        await WatchlistItem_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.default = router;
