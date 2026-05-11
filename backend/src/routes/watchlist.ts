import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";
import WatchlistItem from "../models/WatchlistItem";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

interface WatchlistBody {
  movieId?: unknown;
  title?: unknown;
  year?: unknown;
  poster_path?: unknown;
}

interface ValidWatchlistBody {
  movieId: number;
  title: string;
  year?: string;
  poster_path?: string;
}

const router = Router();

router.use(authMiddleware);

const getUserId = (req: Request) => {
  const userId = (req as AuthenticatedRequest).userId;
  if (!userId) {
    throw new Error("Authenticated request is missing userId");
  }
  return userId;
};

const isValidItemId = (id: string) => mongoose.Types.ObjectId.isValid(id);

const isValidRating = (rating: unknown): rating is number =>
  typeof rating === "number" &&
  Number.isInteger(rating) &&
  rating >= 1 &&
  rating <= 5;

const isValidWatchlistBody = (body: unknown): body is ValidWatchlistBody => {
  if (!body || typeof body !== "object") return false;

  const { movieId, title, year, poster_path } = body as WatchlistBody;
  return (
    Number.isInteger(movieId) &&
    typeof title === "string" &&
    title.trim().length > 0 &&
    (year === undefined || typeof year === "string") &&
    (poster_path === undefined || typeof poster_path === "string")
  );
};

const getRouteId = (req: Request) => {
  const { id } = req.params;
  return typeof id === "string" ? id : "";
};

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const items = await WatchlistItem.find({ userId });
    res.json(items);
  } catch (err) {
    console.error("[watchlist:get]", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:id/rating", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const itemId = getRouteId(req);
    const rating = (req.body as { rating?: unknown } | null)?.rating;

    if (!isValidItemId(itemId)) {
      return res.status(404).json({ message: "Not found" });
    }
    if (!isValidRating(rating)) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const item = await WatchlistItem.findOneAndUpdate(
      { _id: itemId, userId },
      { rating },
      { new: true },
    );

    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(item);
  } catch (err) {
    console.error("[watchlist:rate]", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const body = req.body;

    if (!isValidWatchlistBody(body)) {
      return res.status(400).json({ message: "Invalid movie payload" });
    }

    const newItem = new WatchlistItem({
      userId,
      movieId: body.movieId,
      title: body.title.trim(),
      year: body.year ?? "",
      poster_path: body.poster_path ?? "",
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("[watchlist:create]", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const itemId = getRouteId(req);

    if (!isValidItemId(itemId)) {
      return res.status(404).json({ message: "Not found" });
    }

    const item = await WatchlistItem.findOneAndDelete({
      _id: itemId,
      userId,
    });

    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("[watchlist:delete]", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
