import { createSlice } from "@reduxjs/toolkit";
import {
  fetchWatchlist,
  addMovieToDB,
  removeMovieFromDB,
  rateMovie,
} from "./watchlistThunks";

export interface Movie {
  _id?: string;
  id: number;
  movieId?: number;
  title: string;
  year: string;
  poster_path: string;
  rating?: number;
  watched?: boolean;
}

interface WatchlistState {
  movies: Movie[];
  loading: boolean;
  removingIds: string[];
  pendingIds: number[];
}

const initialState: WatchlistState = {
  movies: [],
  loading: false,
  removingIds: [],
  pendingIds: [],
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchWatchlist.rejected, (state) => {
        state.loading = false;
      })

      .addCase(addMovieToDB.pending, (state, action) => {
        state.pendingIds.push(action.meta.arg.id);
      })
      .addCase(addMovieToDB.fulfilled, (state, action) => {
        state.pendingIds = state.pendingIds.filter(
          (id) => id !== action.meta.arg.id,
        );
        const exists = state.movies.some(
          (m) =>
            m.movieId === action.payload.movieId ||
            m.id === action.payload.movieId,
        );
        if (!exists) state.movies.push(action.payload);
      })
      .addCase(addMovieToDB.rejected, (state, action) => {
        state.pendingIds = state.pendingIds.filter(
          (id) => id !== action.meta.arg.id,
        );
      })

      .addCase(removeMovieFromDB.pending, (state, action) => {
        state.removingIds.push(action.meta.arg);
      })
      .addCase(removeMovieFromDB.fulfilled, (state, action) => {
        state.removingIds = state.removingIds.filter(
          (id) => id !== action.payload,
        );
        state.movies = state.movies.filter((m) => m._id !== action.payload);
      })
      .addCase(removeMovieFromDB.rejected, (state, action) => {
        state.removingIds = state.removingIds.filter(
          (id) => id !== action.meta.arg,
        );
      })

      .addCase(rateMovie.fulfilled, (state, action) => {
        const index = state.movies.findIndex(
          (m) => m._id === action.payload._id,
        );
        if (index !== -1) state.movies[index] = action.payload;
      });
  },
});

export default watchlistSlice.reducer;
