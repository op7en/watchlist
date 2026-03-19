import React from "react";
import { useDispatch } from "react-redux";
import { addMovieToDB } from "../features/watchlist/watchlistThunks";
import { AppDispatch } from "../app/store";

interface MovieCardProps {
  id: number;
  title: string;
  year: string;
  poster_path: string;
}

const MovieCard = ({ id, title, year, poster_path }: MovieCardProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAdd = () => {
    dispatch(addMovieToDB({ id, title, year, poster_path }));
  };

  return (
    <div className="movie-card">
      <img src={`https://image.tmdb.org/t/p/w200${poster_path}`} alt={title} />
      <div className="movie-card-body">
        <p className="movie-card-title">{title}</p>
        <p className="movie-card-year">{year}</p>
        <div className="movie-card-actions">
          <button className="btn-add" onClick={handleAdd}>
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
