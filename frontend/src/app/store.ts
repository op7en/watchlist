import { configureStore } from "@reduxjs/toolkit";
import watchlistReducer from "../features/watchlist/watchlistSlice";
import moviesReducer from "../features/movies/moviesSlice";

import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    watchlist: watchlistReducer,
    movies: moviesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
