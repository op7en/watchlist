import mongoose, { Document, Schema } from "mongoose";

export interface IWatchlistItem extends Document {
  userId: string;
  movieId: number;
  title: string;
  year: string;
  poster_path: string;
  dateAdded: Date;
}
const WatchlistItemSchema: Schema<IWatchlistItem> = new Schema({
  userId: { type: String, required: true },
  movieId: { type: Number, required: true },
  title: { type: String, required: true },
  year: { type: String, default: "" },
  poster_path: { type: String, default: "" },
  dateAdded: { type: Date, default: Date.now },
});
export default mongoose.model<IWatchlistItem>(
  "WatchlistItem",
  WatchlistItemSchema,
);
