import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { removeMovieFromDB } from "../features/watchlist/watchlistThunks";
import axios from "axios";

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
    <div>
      <h2>Watchlist</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie._id}>
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
            />
            {movie.title} ({movie.year}){" "}
            <button onClick={() => handleTrailer(movie.movieId)}>
              Watch Trailer
            </button>
            <button onClick={() => dispatch(removeMovieFromDB(movie._id!))}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;
