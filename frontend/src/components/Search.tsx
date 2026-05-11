import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { clearMovies, fetchMovies } from "../features/movies/moviesSlice";

const SEARCH_DEBOUNCE_MS = 350;

const Search = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const timeoutRef = useRef<number | null>(null);
  const activeRequestRef = useRef<{ abort: () => void } | null>(null);

  const clearPendingSearch = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    activeRequestRef.current?.abort();
  }, []);

  const runSearch = useCallback(
    (value: string) => {
      const trimmed = value.trim();

      clearPendingSearch();
      if (!trimmed) {
        dispatch(clearMovies());
        return;
      }

      activeRequestRef.current = dispatch(fetchMovies(trimmed));
    },
    [clearPendingSearch, dispatch],
  );

  useEffect(() => {
    const trimmed = query.trim();

    clearPendingSearch();
    if (!trimmed) {
      dispatch(clearMovies());
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      runSearch(trimmed);
    }, SEARCH_DEBOUNCE_MS);

    return clearPendingSearch;
  }, [clearPendingSearch, dispatch, query, runSearch]);

  const handleSearch = () => {
    runSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="search-wrapper">
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className="btn-search"
        disabled={!query.trim()}
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default Search;
