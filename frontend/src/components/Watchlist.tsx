import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { removeMovieFromDB } from "../features/watchlist/watchlistThunks";
import { rateMovie } from "../features/watchlist/watchlistThunks";
import { useTrailer } from "../hooks/useTrailer";

const Watchlist = () => {
  const { movies, loading, removingIds } = useSelector(
    (state: RootState) => state.watchlist,
  );

  const dispatch = useDispatch<AppDispatch>();
  const { openTrailer, loadingId } = useTrailer();

  // Состояние загрузки — скелетоны
  if (loading) {
    return (
      <div className="watchlist-section">
        <h2 className="watchlist-title">My Watchlist</h2>
        <ul className="watchlist-list">
          {[1, 2, 3].map((i) => (
            <li className="watchlist-item" key={i}>
              <div
                className="skeleton"
                style={{
                  width: 80,
                  height: 120,
                  borderRadius: 6,
                  flexShrink: 0,
                }}
              />
              <div
                className="watchlist-item-info"
                style={{
                  flex: 1,
                  gap: 8,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  className="skeleton skeleton-line"
                  style={{ width: "50%" }}
                />
                <div
                  className="skeleton skeleton-line short"
                  style={{ width: "30%" }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="watchlist-section">
      <h2 className="watchlist-title">My Watchlist</h2>
      {movies.length === 0 ? (
        <p className="watchlist-empty">No movies added yet.</p>
      ) : (
        <ul className="watchlist-list fade-in">
          {movies.map((movie) => {
            const isRemoving = removingIds.includes(movie._id!);
            return (
              <li
                className="watchlist-item"
                key={movie._id}
                style={{
                  opacity: isRemoving ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                />
                <div className="watchlist-item-info">
                  <p className="watchlist-item-title">{movie.title}</p>
                  <p className="watchlist-item-year">{movie.year}</p>
                </div>
                <div className="watchlist-item-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`btn-star ${movie.rating && movie.rating >= star ? "active" : ""}`}
                      onClick={() =>
                        dispatch(rateMovie({ id: movie._id!, rating: star }))
                      }
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="watchlist-item-actions">
                  <button
                    className="btn-trailer"
                    disabled={loadingId === movie.movieId}
                    onClick={() => openTrailer(movie.movieId!)}
                  >
                    {loadingId === movie.movieId ? (
                      <span className="btn-spinner" />
                    ) : (
                      "Trailer"
                    )}
                  </button>
                  <button
                    className="btn-remove"
                    disabled={isRemoving}
                    onClick={() => dispatch(removeMovieFromDB(movie._id!))}
                  >
                    {isRemoving ? <span className="btn-spinner" /> : "Remove"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Watchlist;
