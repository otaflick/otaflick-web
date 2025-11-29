import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import '../../css/MovieBanner.css';

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

interface MovieBannerProps {
  moviesList: Movie[];
  handleBanner: (movie: Movie) => void;
  posterPlayButton: (movieID: string, movieLink: string, movieTitle: string) => void;
  posterInfoButton: (movie: Movie) => void;
  isTablet: boolean;
}

const MovieBanner = ({ moviesList, handleBanner, posterInfoButton, isTablet }: MovieBannerProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Filter movies that have valid poster/backdrop images (less restrictive)
    const filteredMovies = moviesList.filter(movie => 
        movie && 
        ((movie.posterPath && movie.posterPath.startsWith('http')) || 
         (movie.backdropPath && movie.backdropPath.startsWith('http')))
    );

    // Take only first 5 movies for banner
    const bannerMovies = filteredMovies.slice(0, 5);

    // Auto slide functionality
    useEffect(() => {
        if (bannerMovies.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerMovies.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [bannerMovies.length]);

    const handleInfoClick = (item: Movie, e: React.MouseEvent) => {
        e.stopPropagation();
        posterInfoButton(item);
    };

    const handleBannerClick = (item: Movie) => {
        console.log('Clicked movie:', item.title);
        console.log('Current slide:', currentSlide);
        console.log('Movie at current slide:', bannerMovies[currentSlide]?.title);
        handleBanner(item);
    };
    // Don't render if no movies
    if (bannerMovies.length === 0) {
        return null; // Return null instead of a message to avoid taking space
    }

    return (
        <div className="movie-banner-container">
            <div className="banner-slider">
                {bannerMovies.map((movie, index) => (
                    <div
                        key={movie._id}
                        className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => handleBannerClick(movie)}
                    >
                        <div 
                            className="banner-background"
                            style={{
                                backgroundImage: `url(${isTablet && movie.backdropPath ? movie.backdropPath : movie.posterPath})`
                            }}
                        />
                        
                        
                        
                        <div className="banner-overlay">
                            <div className="banner-content">
                                <h2 className="movie-title">{movie.title}</h2>
                                
                            </div>
                            
                            <div className="banner-controls">
                                <button 
                                    className="info-button"
                                    onClick={(e) => handleInfoClick(movie, e)}
                                >
                                    <Info className="info-icon" />
                                    <span className="info-text">Info</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slide indicators */}
            {/* {bannerMovies.length > 1 && (
                <div className="slide-indicators">
                    {bannerMovies.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            )} */}
        </div>
    );
};

export default MovieBanner;