import { useState, useEffect } from 'react';
import MovieBanner from '../components/movie/movieBanner';
import MovieCards from '../components/movie/movieCard';
import {
    getAllMoviesGenres,
    getLatestMovies,
    getRecentAddedMovies,
    moviesListAPI,
} from '../hooks/requestInstance';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../css/HomeScreen.css';

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





export default function HomeScreen() {
    const [moviesList, setMoviesList] = useState<Movie[]>([]);
    const [recentAddedMovies, setRecentAddedMovies] = useState<Movie[]>([]);
    const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
    const [allGenres, setAllGenres] = useState<string[]>([]);
    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    
    const navigate = useNavigate();

    // Detect screen size for responsive design
    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsTablet(width >= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    const fetchAllData = async () => {
        try {
            const [movies, recentMovies, latestMoviesList, genres] = await Promise.all([
                moviesListAPI(),
                getRecentAddedMovies(),
                getLatestMovies(),
                getAllMoviesGenres(),
            ]);

            setMoviesList(movies.movies || []);
            setRecentAddedMovies(recentMovies.movies || []);
            setLatestMovies(latestMoviesList.movies || []);
            setAllGenres(genres.genres || []);
        } catch (error) {
            console.error("Error loading movies data:", error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchAllData();
            setLoading(false);
        };

        loadData();
    }, []);

   

    const handleBanner = (movie: Movie) => {
    navigate(`/movie/${movie._id}`, { state: { movie } }); // Fixed
    };

    const posterPlayButton = async (movieID: string, movieLink: string, movieTitle: string) => {
        try {
            const httpAddress = localStorage.getItem('httpAddress');
            if (httpAddress) {
                const updatedLink = movieLink.replace(/^https?:\/\/[^\/]+/, httpAddress);
                navigate('/movie-player', { 
                    state: {
                        movieID,
                        movieLink: updatedLink,
                        movieTitle
                    }
                });
            } else {
                navigate('/movie-player', { 
                    state: {
                        movieID,
                        movieLink,
                        movieTitle
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching httpAddress from localStorage:", error);
        }
    };

    const posterInfoButton = (movie: Movie) => {
    navigate(`/movie/${movie._id}`, { state: { movie } }); // Fixed
    };

    const handleMovieDetails = (movie: Movie) => {
    navigate(`/movie/${movie._id}`, { state: { movie } }); // Fixed
    };

    const handleSearchPress = () => {
        navigate('/search');
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading Movies...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Search Button */}
            <button 
                className="search-button"
                onClick={handleSearchPress}
            >
                <div className="search-button-content">
                    <Search size={20} color="#FFFFFF" />
                    <span className="search-button-text">Search Movies</span>
                </div>
                <div className="search-button-glow" />
            </button>

            {/* Movie Banner */}
            {moviesList.length > 0 && (
                <MovieBanner
                    moviesList={moviesList}
                    handleBanner={handleBanner}
                    posterPlayButton={posterPlayButton}
                    posterInfoButton={posterInfoButton}
                    isTablet={isTablet}
                />
            )}

            <div className="sub-container">
                {/* Recently Added - Horizontal Scroll */}
                {recentAddedMovies.length > 0 && (
                    <MovieCards
                        key="recent"
                        genre="Recently Added"
                        moviesList={recentAddedMovies}
                        handleMovieDetails={handleMovieDetails}
                        isTablet={isTablet}
                    />
                )}

                {/* Trending - Horizontal Scroll */}
                {latestMovies.length > 0 && (
                    <MovieCards
                        key="latest"
                        genre="Trending"
                        moviesList={latestMovies}
                        handleMovieDetails={handleMovieDetails}
                        isTablet={isTablet}
                    />
                )}

                {/* All Genres - Horizontal Scroll for each genre */}
                {allGenres.map((genre) => (
                    <MovieCards
                        key={genre}
                        genre={genre}
                        moviesList={moviesList}
                        handleMovieDetails={handleMovieDetails}
                        isTablet={isTablet}
                    />
                ))}

                {/* Empty state handling */}
                {moviesList.length === 0 && !loading && (
                    <div className="empty-container">
                        <div className="empty-icon">😞</div>
                        <p className="empty-text">No movies found</p>
                        <p className="empty-subtext">Refresh the page to try again</p>
                    </div>
                )}
            </div>
        </div>
    );
}