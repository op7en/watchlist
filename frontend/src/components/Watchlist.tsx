import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { removeMovieFromDB } from "../features/watchlist/watchlistThunks";
import axios from "axios";
import { rateMovie } from "../features/watchlist/watchlistThunks";
const Watchlist = () => {
  const movies = useSelector((state: RootState) => state.watchlist.movies);
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

  return (
    <div className="watchlist-section">
      <h2 className="watchlist-title">My Watchlist</h2>
      {movies.length === 0 ? (
        <p className="watchlist-empty">No movies added yet.</p>
      ) : (
        <ul className="watchlist-list">
          {movies.map((movie) => (
            <li className="watchlist-item" key={movie._id}>
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
                  onClick={() => handleTrailer(movie.movieId!)}
                >
                  Trailer
                </button>
                <button
                  className="btn-remove"
                  onClick={() => dispatch(removeMovieFromDB(movie._id!))}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Watchlist;
