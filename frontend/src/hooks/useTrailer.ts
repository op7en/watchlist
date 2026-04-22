// src/hooks/useTrailer.ts
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

interface TmdbVideo {
  type: string;
  site: string;
  key: string;
}

export const useTrailer = () => {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const openTrailer = async (movieId: number) => {
    try {
      setLoadingId(movieId);
      const res = await axios.get<{ results: TmdbVideo[] }>(
        `https://api.themoviedb.org/3/movie/${movieId}/videos`,
        { params: { api_key: process.env.REACT_APP_TMDB_API_KEY } },
      );
      const trailer = res.data.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube",
      );
      if (!trailer) {
        toast.info("No trailer available");
        return;
      }
      window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
    } catch {
      toast.error("Failed to load trailer");
    } finally {
      setLoadingId(null);
    }
  };

  return { openTrailer, loadingId };
};
