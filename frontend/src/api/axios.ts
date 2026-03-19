import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

export const getTrailer = async (movieId: number) => {
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieId}/videos`,
    { params: { api_key: process.env.REACT_APP_TMDB_API_KEY } },
  );
  const trailer = res.data.results.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube",
  );
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
};
