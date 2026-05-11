import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth";
import watchlistRoutes from "./routes/watchlist";

const { MONGO_URI, PORT: ENV_PORT } = process.env;
if (!MONGO_URI) {
  throw new Error("MONGO_URI is not set. App won't start.");
}

const DB_IDLE_DISCONNECT_MS = 5 * 60 * 1000;
let dbIdleTimer: NodeJS.Timeout | null = null;
let mongoConnectPromise: Promise<typeof mongoose> | null = null;

const connectMongo = () => {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose);
  }

  if (!mongoConnectPromise) {
    mongoConnectPromise = mongoose.connect(MONGO_URI).finally(() => {
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
    if (mongoose.connection.readyState !== 1) return;

    try {
      await mongoose.disconnect();
      console.log("MongoDB disconnected after 5 minutes idle");
    } catch (err) {
      console.error("MongoDB idle disconnect failed:", err);
    }
  }, DB_IDLE_DISCONNECT_MS);

  dbIdleTimer.unref();
};

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.use(async (_req, res, next) => {
  try {
    await connectMongo();
    scheduleDbIdleDisconnect();
    next();
  } catch (err) {
    console.error("MongoDB connection unavailable:", err);
    res.status(503).json({ message: "Database unavailable" });
  }
});

app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
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
