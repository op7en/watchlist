"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const watchlist_1 = __importDefault(require("./routes/watchlist"));
const { MONGO_URI, PORT: ENV_PORT } = process.env;
if (!MONGO_URI) {
    throw new Error("MONGO_URI is not set. App won't start.");
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/auth", auth_1.default);
app.use("/watchlist", watchlist_1.default);
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});
const PORT = ENV_PORT || 5000;
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch((err) => {
    console.error("Initial MongoDB connection failed:", err);
    process.exit(1);
});
