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
const DB_IDLE_DISCONNECT_MS = 5 * 60 * 1000;
let dbIdleTimer = null;
let mongoConnectPromise = null;
const connectMongo = () => {
    if (mongoose_1.default.connection.readyState === 1) {
        return Promise.resolve(mongoose_1.default);
    }
    if (!mongoConnectPromise) {
        mongoConnectPromise = mongoose_1.default.connect(MONGO_URI).finally(() => {
            mongoConnectPromise = null;
        });
    }
    return mongoConnectPromise;
};
const scheduleDbIdleDisconnect = () => {
    if (dbIdleTimer) {
        clearTimeout(dbIdleTimer);
    }
    dbIdleTimer = setTimeout(async () => {
        if (mongoose_1.default.connection.readyState !== 1)
            return;
        try {
            await mongoose_1.default.disconnect();
            console.log("MongoDB disconnected after 5 minutes idle");
        }
        catch (err) {
            console.error("MongoDB idle disconnect failed:", err);
        }
    }, DB_IDLE_DISCONNECT_MS);
    dbIdleTimer.unref();
};
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(async (_req, res, next) => {
    try {
        await connectMongo();
        scheduleDbIdleDisconnect();
        next();
    }
    catch (err) {
        console.error("MongoDB connection unavailable:", err);
        res.status(503).json({ message: "Database unavailable" });
    }
});
app.use("/auth", auth_1.default);
app.use("/watchlist", watchlist_1.default);
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});
const PORT = ENV_PORT || 5000;
connectMongo()
    .then(() => {
    console.log("MongoDB connected");
    scheduleDbIdleDisconnect();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch((err) => {
    console.error("Initial MongoDB connection failed:", err);
    process.exit(1);
});
