// src/features/movies/moviesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchMovies } from "./api";
export interface Movie {
  id: number;
  title: string;
  year: string;
  poster_path: string; // ← must be here
}

export interface MoviesState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  movies: [],
  loading: false,
  error: null,
};

// Асинхронный thunk для поиска
export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (query: string) => {
    const results = await searchMovies(query);
    return results.map((m: any) => ({
      id: m.id,
      title: m.title,
      year: m.release_date?.split("-")[0] || "N/A",
      poster_path: m.poster_path || "",
    }));
  },
);

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default moviesSlice.reducer;
