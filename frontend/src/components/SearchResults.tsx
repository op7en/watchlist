import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { Movie } from "../features/movies/moviesSlice";
import { addMovieToDB } from "../features/watchlist/watchlistThunks";
import axios from "axios";

const SearchResults = () => {
  const { movies, loading } = useSelector((state: RootState) => state.movies);
  const watchlist = useSelector((state: RootState) => state.watchlist.movies);
  const dispatch = useDispatch<AppDispatch>();

  const handleTrailer = async (movieId: number) => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos`,
      { params: { api_key: process.env.REACT_APP_TMDB_API_KEY } },
    );
    const trailer = res.data.results.find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube",
    );
    if (trailer) {
      window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
    } else {
      alert("No trailer found");
    }
  };

  if (loading) return <p className="loading">Loading...</p>;

  if (movies.length === 0) return null;

  return (
    <div>
      <p className="section-label">Search Results</p>
      <div className="results-grid">
        {movies.map((movie: Movie) => {
          const isAdded = watchlist.some((m) => m.id === movie.id);

          return (
            <div className="movie-card" key={movie.id}>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="movie-card-body">
                <p className="movie-card-title">{movie.title}</p>
                <p className="movie-card-year">{movie.year}</p>
                <div className="movie-card-actions">
                  <button
                    className="btn-add"
                    onClick={() => dispatch(addMovieToDB(movie))}
                    disabled={isAdded}
                  >
                    {isAdded ? "Added ✓" : "Add"}
                  </button>
                  <button
                    className="btn-trailer"
                    onClick={() => handleTrailer(movie.id)}
                  >
                    Trailer
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
