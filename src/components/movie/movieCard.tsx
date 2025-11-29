import '../../css/MovieCards.css';

interface Movie {
    _id: string;
    title: string;
    posterPath: string;
    backdropPath: string;
    downloadLink: string;
    runtime: number;
    genres: string[];
    releaseDate: string;
    releaseYear: string;
    overview: string;
    description: string;
}

interface MovieCardsProps {
  genre: string;
  moviesList: Movie[];
  handleMovieDetails: (movie: Movie) => void;
  isTablet: boolean;
}

const MovieCards = ({ genre, moviesList, handleMovieDetails }: MovieCardsProps) => {

  // Fisher-Yates Shuffle Algorithm
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Check if movie has download link
  const hasDownloadLink = (movie: Movie): boolean => {
    return !!(movie.downloadLink && movie.downloadLink !== '');
  };

  let filteredMovies: Movie[];

  if (genre === "Recently Added" || genre === "Trending") {
    // No shuffle or filtering needed for "Recently Added" and "Trending" genres
    filteredMovies = moviesList;
  } else {
    // Shuffle and filter for other genres
    filteredMovies = shuffleArray(moviesList.filter((movie) => movie.genres.includes(genre)));
  }

  const handleCardClick = (movie: Movie) => {
    handleMovieDetails(movie);
  };

  // Show ALL movies in the horizontal row
  const moviesToShow = filteredMovies; // Remove the slice limit

  // Don't render if no movies
  if (moviesToShow.length === 0) {
    return null;
  }

  return (
    <div className="movie-cards-container">
      <h2 className="genre-label">{genre}</h2>
      <div className="movies-scroll-container">
        <div className="movies-grid">
          {moviesToShow.map((movie) => {
            const hasDownload = hasDownloadLink(movie);
            
            return (
              <div
                key={movie._id}
                className="movie-card"
                onClick={() => handleCardClick(movie)}
              >
                <div className="movie-card-image-container">
                  <img
                    className={`movie-card-image ${!hasDownload ? 'coming-soon' : ''}`}
                    src={movie.posterPath}
                    alt={movie.title}
                    loading="lazy"
                  />
                  {!hasDownload && (
                    <div className="coming-soon-overlay">
                      <span className="coming-soon-text">Coming Soon</span>
                    </div>
                  )}
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-year">{movie.releaseYear}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MovieCards;