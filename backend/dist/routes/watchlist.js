"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const WatchlistItem_1 = __importDefault(require("../models/WatchlistItem"));
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
const getUserId = (req) => {
    const userId = req.userId;
    if (!userId) {
        throw new Error("Authenticated request is missing userId");
    }
    return userId;
};
const isValidItemId = (id) => mongoose_1.default.Types.ObjectId.isValid(id);
const isValidRating = (rating) => typeof rating === "number" &&
    Number.isInteger(rating) &&
    rating >= 1 &&
    rating <= 5;
const isValidWatchlistBody = (body) => {
    if (!body || typeof body !== "object")
        return false;
    const { movieId, title, year, poster_path } = body;
    return (Number.isInteger(movieId) &&
        typeof title === "string" &&
        title.trim().length > 0 &&
        (year === undefined || typeof year === "string") &&
        (poster_path === undefined || typeof poster_path === "string"));
};
const getRouteId = (req) => {
    const { id } = req.params;
    return typeof id === "string" ? id : "";
};
router.get("/", async (req, res) => {
    try {
        const userId = getUserId(req);
        const items = await WatchlistItem_1.default.find({ userId });
        res.json(items);
    }
    catch (err) {
        console.error("[watchlist:get]", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.patch("/:id/rating", async (req, res) => {
    try {
        const userId = getUserId(req);
        const itemId = getRouteId(req);
        const rating = req.body?.rating;
        if (!isValidItemId(itemId)) {
            return res.status(404).json({ message: "Not found" });
        }
        if (!isValidRating(rating)) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }
        const item = await WatchlistItem_1.default.findOneAndUpdate({ _id: itemId, userId }, { rating }, { new: true });
        if (!item) {
            return res.status(404).json({ message: "Not found" });
        }
        res.json(item);
    }
    catch (err) {
        console.error("[watchlist:rate]", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/", async (req, res) => {
    try {
        const userId = getUserId(req);
        const body = req.body;
        if (!isValidWatchlistBody(body)) {
            return res.status(400).json({ message: "Invalid movie payload" });
        }
        const newItem = new WatchlistItem_1.default({
            userId,
            movieId: body.movieId,
            title: body.title.trim(),
            year: body.year ?? "",
            poster_path: body.poster_path ?? "",
        });
        await newItem.save();
        res.status(201).json(newItem);
    }
    catch (err) {
        console.error("[watchlist:create]", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const userId = getUserId(req);
        const itemId = getRouteId(req);
        if (!isValidItemId(itemId)) {
            return res.status(404).json({ message: "Not found" });
        }
        const item = await WatchlistItem_1.default.findOneAndDelete({
            _id: itemId,
            userId,
        });
        if (!item) {
            return res.status(404).json({ message: "Not found" });
        }
        res.json({ message: "Deleted" });
    }
    catch (err) {
        console.error("[watchlist:delete]", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = router;
