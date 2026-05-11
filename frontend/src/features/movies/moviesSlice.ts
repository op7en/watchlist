import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { searchMovies, TmdbMovie } from "./api";

export interface Movie {
  id: number;
  title: string;
  year: string;
  poster_path: string;
}

export interface MoviesState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  currentRequestId: string | null;
}

const initialState: MoviesState = {
  movies: [],
  loading: false,
  error: null,
  currentRequestId: null,
};

const toMovie = (movie: TmdbMovie): Movie => ({
  id: movie.id,
  title: movie.title,
  year: movie.release_date?.split("-")[0] || "N/A",
  poster_path: movie.poster_path || "",
});

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (query: string, { signal }) => {
    const results = await searchMovies(query, signal);
    return results.map(toMovie);
  },
);

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    clearMovies(state) {
      state.movies = [];
      state.loading = false;
      state.error = null;
      state.currentRequestId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.movies = action.payload;
        state.currentRequestId = null;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.currentRequestId = null;
        if (!action.meta.aborted) {
          state.error = action.error.message || "Failed to search movies";
        }
      });
  },
});

export const { clearMovies } = moviesSlice.actions;
export default moviesSlice.reducer;
