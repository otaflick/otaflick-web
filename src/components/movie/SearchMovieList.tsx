import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/SearchMovieList.css';

// Types
export interface Movie {
  _id: string;
  title: string;
  posterPath: string;
  releaseDate: string;
  genres: string[];
  runtime: number;
  description?: string;
  backdropPath?: string;
  downloadLink?: string;
  releaseYear?: number;
}

interface SearchMovieListProps {
  data?: Movie[]; // Make data optional
  isTablet?: boolean;
  loadMoreMovies?: () => void;
  loading?: boolean;
}

const SearchMovieList: React.FC<SearchMovieListProps> = ({ 
  data = [], // Provide default value
  loadMoreMovies, 
  loading = false 
}) => {
  const navigate = useNavigate();

  const formatReleaseDate = (dateString: string): string => {
    try {
      const year = new Date(dateString).getFullYear();
      return year.toString();
    } catch (error) {
      return 'N/A';
    }
  };

  const formatRuntime = (minutes: number): string => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const handleMoviePress = (movie: Movie) => {
    navigate('/movie-details', { 
      state: { movie } 
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!loadMoreMovies) return;
    
    const element = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = element;
    
    // Load more when 80% scrolled
    if (scrollHeight - scrollTop <= clientHeight * 1.2) {
      loadMoreMovies();
    }
  };

  return (
    <div className="search-movie-list-containers">
      <div 
        className="movies-scroll-container"
        onScroll={handleScroll}
      >
        {data.map((movie) => (
          <div
            key={movie._id}
            className="movie-card"
            onClick={() => handleMoviePress(movie)}
          >
              <img 
                src={movie.posterPath} 
                alt={movie.title}
                className="poster-image"
              />
              <div className="movie-info">
                <h3 className="movie-title">
                  {movie.title} ({formatReleaseDate(movie.releaseDate)})
                </h3>
                <div className="genre-container">
                  {movie.genres.slice(0, 3).map((genre, index) => (
                    <span key={index} className="genre-tag">
                      {genre}
                    </span>
                  ))}
                  {movie.genres.length > 3 && (
                    <span className="genre-tag more-tag">
                      +{movie.genres.length - 3} more
                    </span>
                  )}
                </div>
                <p className="movie-runtime">
                  {formatRuntime(movie.runtime)}
                </p>
                {movie.description && (
                  <p className="movie-description">
                    {movie.description.length > 120 
                      ? `${movie.description.substring(0, 120)}...` 
                      : movie.description
                    }
                  </p>
                )}
              </div>
            </div>
        ))}
        
        {/* Loading Indicator */}
        {loading && (
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <span>Loading more movies...</span>
          </div>
        )}
        
        {/* Empty State */}
        {data.length === 0 && !loading && (
          <div className="empty-state">
            <h3>No movies found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMovieList;