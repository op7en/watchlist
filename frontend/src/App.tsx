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
  }, [token]);

  if (!token) return <Auth />;

  return (
    <div>
      <button onClick={() => dispatch(logout())}>Logout</button>
      <Search />
      <SearchResults />
      <Watchlist />
    </div>
  );
}

export default App;
