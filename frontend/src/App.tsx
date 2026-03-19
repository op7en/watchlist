import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./app/store";
import { fetchWatchlist } from "./features/watchlist/watchlistThunks";
import Auth from "./components/Auth";
import Search from "./components/Search";
import SearchResults from "./components/SearchResults";
import Watchlist from "./components/Watchlist";
import { logout } from "./features/auth/authSlice";

function App() {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (token) dispatch(fetchWatchlist());
  }, [token, dispatch]);

  if (!token) return <Auth />;

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <span className="app-logo">WATCHLIST</span>
        <button className="btn-logout" onClick={() => dispatch(logout())}>
          Logout
        </button>
      </header>
      <Search />
      <SearchResults />
      <Watchlist />
    </div>
  );
}

export default App;
