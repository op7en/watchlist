"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const watchlist_1 = __importDefault(require("./routes/watchlist"));
// import tmdbRoutes from "./routes/tmdb";
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/auth", auth_1.default);
app.use("/watchlist", watchlist_1.default);
// app.use("/tmdb", tmdbRoutes);
const PORT = process.env.PORT || 5000;
mongoose_1.default
    .connect(process.env.MONGO_URI || "")
    .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch((err) => console.log(err));
// Close MongoDB connection after 10 minutes of inactivity
let inactivityTimer;
const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(async () => {
        await mongoose_1.default.disconnect();
        console.log("MongoDB disconnected due to inactivity");
    }, 5 * 60 * 1000);
};
// Reconnect on request if disconnected
app.use(async (req, res, next) => {
    if (mongoose_1.default.connection.readyState === 0) {
        await mongoose_1.default.connect(process.env.MONGO_URI || "");
        console.log("MongoDB reconnected");
    }
    resetInactivityTimer();
    next();
});
resetInactivityTimer();
