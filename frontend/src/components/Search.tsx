import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { fetchMovies } from "../features/movies/moviesSlice";

const Search = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSearch = () => {
    if (!query.trim()) return;
    dispatch(fetchMovies(query));
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
      <button className="btn-search" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default Search;
