import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import WatchlistItem, { IWatchlistItem } from "../models/WatchlistItem";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req: Request, res: Response) => {
  try {
    const items = await WatchlistItem.find({ userId: (req as any).userId });
    res.json(items);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.patch("/:id/rating", async (req: Request, res: Response) => {
  try {
    const { rating } = req.body;
    const item = await WatchlistItem.findByIdAndUpdate(
      req.params.id,
      { rating },
      { new: true },
    );
    res.json(item);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { movieId, title, year, poster_path } = req.body;
    const newItem = new WatchlistItem({
      userId: (req as any).userId,
      movieId,
      title,
      year,
      poster_path,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await WatchlistItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
