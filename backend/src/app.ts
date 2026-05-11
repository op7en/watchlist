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

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = ENV_PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Initial MongoDB connection failed:", err);
    process.exit(1);
  });
