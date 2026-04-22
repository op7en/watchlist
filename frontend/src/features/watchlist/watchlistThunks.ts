import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";
import { Movie } from "../movies/moviesSlice";
import axios from "axios";
export const fetchWatchlist = createAsyncThunk("watchlist/fetch", async () => {
  const res = await API.get("/watchlist");
  return res.data;
});
export const addMovieToDB = createAsyncThunk(
  "watchlist/add",
  async (movie: Movie, { rejectWithValue }) => {
    try {
      const res = await API.post("/watchlist", {
        movieId: movie.id,
        title: movie.title,
        year: movie.year,
        poster_path: movie.poster_path,
      });
      return res.data;
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Failed to add movie")
        : "Failed to add movie";
      return rejectWithValue(message);
    }
  },
);

export const removeMovieFromDB = createAsyncThunk(
  "watchlist/remove",
  async (id: string, { rejectWithValue }) => {
    try {
      await API.delete(`/watchlist/${id}`);
      return id;
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Failed to remove movie")
        : "Failed to remove movie";
      return rejectWithValue(message);
    }
  },
);

export const rateMovie = createAsyncThunk(
  "watchlist/rate",
  async ({ id, rating }: { id: string; rating: number }) => {
    const res = await API.patch(`/watchlist/${id}/rating`, { rating });
    return res.data;
  },
);
