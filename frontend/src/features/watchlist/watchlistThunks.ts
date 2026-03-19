import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";
import { Movie } from "../movies/moviesSlice";

export const fetchWatchlist = createAsyncThunk("watchlist/fetch", async () => {
  const res = await API.get("/watchlist");
  return res.data;
});

export const addMovieToDB = createAsyncThunk(
  "watchlist/add",
  async (movie: Movie) => {
    const res = await API.post("/watchlist", {
      movieId: movie.id,
      title: movie.title,
      year: movie.year,
      poster_path: movie.poster_path,
    });
    return res.data;
  },
);

export const removeMovieFromDB = createAsyncThunk(
  "watchlist/remove",
  async (id: string) => {
    await API.delete(`/watchlist/${id}`);
    return id;
  },
);
