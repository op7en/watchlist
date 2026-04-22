import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth";
import watchlistRoutes from "./routes/watchlist";

dotenv.config();

// Валидация env при старте — падаем громко, не тихо
const { MONGO_URI, PORT: ENV_PORT } = process.env;
if (!MONGO_URI) {
  throw new Error("MONGO_URI is not set. App won't start.");
}

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);

const PORT = ENV_PORT || 5000;

// Reconnect с защитой от race condition
let isConnecting = false;

app.use(async (req, res, next) => {
  const state = mongoose.connection.readyState;
  // 1 = connected, 2 = connecting — в обоих случаях не трогаем
  if (state === 1 || state === 2) {
    resetInactivityTimer();
    return next();
  }

  if (!isConnecting) {
    isConnecting = true;
    try {
      await mongoose.connect(MONGO_URI);
      console.log("MongoDB reconnected");
    } catch (err) {
      console.error("MongoDB reconnect failed:", err);
      isConnecting = false;
      return res.status(503).json({ message: "Database unavailable" });
    }
    isConnecting = false;
  } else {
    // Другой запрос уже коннектится — ждём
    await new Promise<void>((resolve) => {
      const check = setInterval(() => {
        if (mongoose.connection.readyState === 1) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
  }

  resetInactivityTimer();
  next();
});

let inactivityTimer: NodeJS.Timeout;

const resetInactivityTimer = () => {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(
    async () => {
      await mongoose.disconnect();
      console.log("MongoDB disconnected due to inactivity");
    },
    5 * 60 * 1000,
  );
};

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    resetInactivityTimer();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Initial MongoDB connection failed:", err);
    process.exit(1); // не висим в зомби-состоянии
  });
