const MovieCardSkeleton = () => (
  <div className="movie-card">
    <div className="skeleton skeleton-poster" />
    <div className="movie-card-body">
      <div className="skeleton skeleton-line" style={{ marginBottom: 8 }} />
      <div className="skeleton skeleton-line short" />
    </div>
  </div>
);

export default MovieCardSkeleton;
