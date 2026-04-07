import mongoose, { Document, Schema } from "mongoose";

export interface IWatchlistItem extends Document {
  userId: string;
  movieId: number;
  title: string;
  year: string;
  rating: number;
  poster_path: string;
  watched: boolean; // добавлено
  dateAdded: Date;
}

const WatchlistItemSchema: Schema<IWatchlistItem> = new Schema({
  userId: { type: String, required: true },
  movieId: { type: Number, required: true },
  title: { type: String, required: true },
  year: { type: String, default: "" },
  poster_path: { type: String, default: "" },
  rating: { type: Number, default: 0 },
  watched: { type: Boolean, default: false },
  dateAdded: { type: Date, default: Date.now },
});

export default mongoose.model<IWatchlistItem>(
  "WatchlistItem",
  WatchlistItemSchema,
);
