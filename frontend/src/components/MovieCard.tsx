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
    <div>
      <h3>{title}</h3>
      <p>{year}</p>
      <button onClick={handleAdd}>Add to Watchlist</button>
    </div>
  );
};

export default MovieCard;
