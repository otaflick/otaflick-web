import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SearchMovieList from '../components/movie/SearchMovieList';
import { movieSearchAPI, moviesListAPI } from '../hooks/requestInstance';
import '../css/MoviesSearchScreen.css';


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

// Types for API responses
interface MoviesResponse {
  movies?: Movie[];
  success?: boolean;
  message?: string;
}

// Movie Search Screen with Infinite Scroll
export default function MoviesSearchScreen() {
    const [searchText, setSearchText] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [moviesList, setMoviesList] = useState<Movie[]>([]);
    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [moviesPerPage] = useState<number>(20);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const navigate = useNavigate();

    // Handle responsive screen size
    useEffect(() => {
        const updateScreenSize = () => {
            setIsTablet(window.innerWidth >= 768);
        };

        updateScreenSize();
        window.addEventListener('resize', updateScreenSize);

        return () => {
            window.removeEventListener('resize', updateScreenSize);
        };
    }, []);

    useEffect(() => {
        const moviesListAPICall = async () => {
            try {
                const response = await moviesListAPI();
                // Handle the API response properly
                const movies = (response as MoviesResponse)?.movies || [];
                setAllMovies(movies);
                setMoviesList(movies.slice(0, moviesPerPage));
            } catch (error) {
                console.error('Error fetching movies list:', error);
                setAllMovies([]);
                setMoviesList([]);
            }
        };

        moviesListAPICall();
    }, []);

    const handleSearch = async (text: string) => {
        setSearchText(text);
        
        if (text.length > 0) {
            setIsSearching(true);
            setLoading(true);
            try {
                const response = await movieSearchAPI(text);
                
                // Handle different response formats
                let results: Movie[] = [];
                
                if (response) {
                    if (Array.isArray(response)) {
                        // Response is already an array of movies
                        results = response;
                    } else if (response.movies && Array.isArray(response.movies)) {
                        // Response has movies property
                        results = response.movies;
                    } else if (response && typeof response === 'object' && '_id' in response) {
                        // Response is a single movie object
                        results = [response as Movie];
                    }
                }
                
                setSearchResults(results);
                
            } catch (error) {
                console.error('Error searching movies:', error);
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        } else {
            setIsSearching(false);
            setSearchResults([]);
        }
    };

    // Function to load more movies on infinite scroll
    const loadMoreMovies = () => {
        if (!loading && moviesList.length < allMovies.length && !isSearching) {
            setLoading(true);
            const nextMovies = allMovies.slice(moviesList.length, moviesList.length + moviesPerPage);
            setMoviesList([...moviesList, ...nextMovies]);
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleSearch(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchText('');
        setIsSearching(false);
        setSearchResults([]);
    };

    return (
        <div className="movies-search-container">
            {/* Header with Back Button */}
            <header className="search-header">
                <button onClick={handleBack} className="back-button">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="header-title">Search Movies</h1>
                <div className="header-placeholder" />
            </header>

            {/* Search Input */}
            <div className="search-input-container">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="Search movies..."
                        className="search-input"
                        onChange={handleInputChange}
                        value={searchText}
                    />
                    {searchText && (
                        <button 
                            className="clear-button"
                            onClick={handleClearSearch}
                            aria-label="Clear search"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <main className="search-content">
                {/* Show search results when searching */}
                {isSearching ? (
                    <div className="results-container">
                        <h2 className="results-label">
                            {loading ? 'Searching...' : `Search Results (${searchResults.length})`}
                        </h2>
                        
                        {!loading && searchResults.length === 0 ? (
                            <div className="no-results-container">
                                <p className="no-results">No movies found for "{searchText}"</p>
                                <p className="no-results-subtitle">Try different keywords</p>
                            </div>
                        ) : (
                            <SearchMovieList 
                                data={searchResults} 
                                isTablet={isTablet}
                                loading={loading}
                            />
                        )}
                    </div>
                ) : (
                    /* Show all movies when not searching */
                    <div className="movies-container">
                        <h2 className="all-movies-label">All Movies ({allMovies.length})</h2>
                        <SearchMovieList
                            data={moviesList}
                            isTablet={isTablet}
                            loadMoreMovies={loadMoreMovies}
                            loading={loading}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}