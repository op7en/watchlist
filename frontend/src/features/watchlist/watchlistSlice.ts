import { createSlice } from "@reduxjs/toolkit";
import {
  fetchWatchlist,
  addMovieToDB,
  removeMovieFromDB,
} from "./watchlistThunks";

export interface Movie {
  _id?: string;
  id: number;
  movieId?: number;
  title: string;
  year: string;
  poster_path: string;
}

interface WatchlistState {
  movies: Movie[];
}

const initialState: WatchlistState = {
  movies: [],
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.movies = action.payload;
      })
      .addCase(addMovieToDB.fulfilled, (state, action) => {
        const exists = state.movies.some(
          (m) =>
            m.movieId === action.payload.movieId ||
            m.id === action.payload.movieId,
        );
        if (!exists) state.movies.push(action.payload);
      })
      .addCase(removeMovieFromDB.fulfilled, (state, action) => {
        state.movies = state.movies.filter((m) => m._id !== action.payload);
      });
  },
});

export default watchlistSlice.reducer;
