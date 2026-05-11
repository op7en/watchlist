import mongoose, { Schema } from "mongoose";

export interface IWatchlistItem {
  userId: string;
  movieId: number;
  title: string;
  year: string;
  rating: number;
  poster_path: string;
  watched: boolean;
  dateAdded: Date;
}

const WatchlistItemSchema = new Schema({
  userId: { type: String, required: true },
  movieId: { type: Number, required: true },
  title: { type: String, required: true },
  year: { type: String, default: "" },
  poster_path: { type: String, default: "" },
  rating: { type: Number, default: 0 },
  watched: { type: Boolean, default: false },
  dateAdded: { type: Date, default: Date.now },
});

WatchlistItemSchema.index({ userId: 1 });

const WatchlistItem = (mongoose.model as any)(
  "WatchlistItem",
  WatchlistItemSchema,
);

export default WatchlistItem;
