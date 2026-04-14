import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth";
import watchlistRoutes from "./routes/watchlist";
// import tmdbRoutes from "./routes/tmdb";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);
// app.use("/tmdb", tmdbRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));

// Close MongoDB connection after 10 minutes of inactivity
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

// Reconnect on request if disconnected
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("MongoDB reconnected");
  }
  resetInactivityTimer();
  next();
});

resetInactivityTimer();
