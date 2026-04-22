import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { Movie } from "../features/movies/moviesSlice";
import { addMovieToDB } from "../features/watchlist/watchlistThunks";
import { useTrailer } from "../hooks/useTrailer";
import MovieCardSkeleton from "./MovieCardSkeleton";

const SearchResults = () => {
  const { movies, loading } = useSelector((state: RootState) => state.movies);
  const watchlist = useSelector((state: RootState) => state.watchlist.movies);
  const pendingIds = useSelector((s: RootState) => s.watchlist.pendingIds);
  const dispatch = useDispatch<AppDispatch>();
  const { openTrailer, loadingId } = useTrailer();

  if (loading) {
    return (
      <div>
        <p className="section-label">Search Results</p>
        <div className="results-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) return null;

  return (
    <div>
      <p className="section-label">Search Results</p>
      <div className="results-grid fade-in">
        {movies.map((movie: Movie) => {
          const isAdded = watchlist.some(
            (m) => m.movieId === movie.id || m.id === movie.id,
          );
          const isPending = pendingIds.includes(movie.id);
          const isTrailerLoading = loadingId === movie.id;

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
                    disabled={isAdded || isPending}
                    onClick={() => dispatch(addMovieToDB(movie))}
                  >
                    {isPending ? (
                      <span className="btn-spinner" />
                    ) : isAdded ? (
                      "Added ✓"
                    ) : (
                      "Add"
                    )}
                  </button>
                  <button
                    className="btn-trailer"
                    disabled={isTrailerLoading}
                    onClick={() => openTrailer(movie.id)}
                  >
                    {isTrailerLoading ? (
                      <span className="btn-spinner" />
                    ) : (
                      "Trailer"
                    )}
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
