import axios from "axios";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = process.env.REACT_APP_TMDB_URL;

export interface TmdbMovie {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string | null;
}

interface TmdbSearchResponse {
  results: TmdbMovie[];
}

export const searchMovies = async (query: string, signal?: AbortSignal) => {
  const response = await axios.get<TmdbSearchResponse>(
    `${BASE_URL}/search/movie`,
    {
      params: {
        api_key: API_KEY,
        query,
      },
      signal,
    },
  );

  return response.data.results;
};
