import  { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Download,  Tv, Speaker, Subtitles, Star } from 'lucide-react';
import SimilarMovies from '../components/movie/SimilarMovies';
import { similarMoviesAPI } from '../hooks/requestInstance';
import '../css/MovieDetails.css';


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

export default function MovieDetails() {
    const location = useLocation();
    const navigate = useNavigate();

    // Get movie from location state
    const movie = useMemo(() => location.state?.movie || null, [location.state]);

    const [similarMoviesList, setSimilarMoviesList] = useState<Movie[]>([]);
    const [isTablet, setIsTablet] = useState(false);
    const [isFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [downloadProgress] = useState<number>(0);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    const hasFetched = useRef(false);

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
        if (!movie || hasFetched.current) {
            return;
        }

        const initializeData = async () => {
            hasFetched.current = true;
            setIsLoading(true);

            try {
                const similarMovies = await similarMoviesAPI(movie._id);
                setSimilarMoviesList(similarMovies || []);
            } catch (error) {
                console.error("Error fetching similar movies:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeData();
    }, [movie]);

    // Check if movie has download link
    const hasDownloadLink = (): boolean => {
        return !!(movie?.downloadLink && movie.downloadLink !== '');
    };

    // Format release date to show only the year
    const formatReleaseYear = (releaseDate: string): string => {
        if (!releaseDate) return 'N/A';

        try {
            const date = new Date(releaseDate);
            return date.getFullYear().toString();
        } catch (error) {
            console.error("Error formatting release date:", error);
            return 'N/A';
        }
    };

    function formatRuntime(minutes: number): string {
        if (!minutes) return 'N/A';

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        return `${hours}h ${remainingMinutes}m`;
    }

    // Download file function for web
    

    // Alternative simpler download method (direct link)
    const handleDownload = async () => {
        if (!hasDownloadLink()) {
            alert("Movie coming soon!");
            return;
        }

        try {
            setIsDownloading(true);

            // Method 1: Direct download (simpler but less control)
            const a = document.createElement('a');
            a.href = movie.downloadLink;
            a.download = `${movie.title}.mp4` || 'movie.mp4';
            a.target = '_blank'; // Open in new tab for large files
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Method 2: Show a download prompt
            // downloadFile(); // Use this for progress tracking

        } catch (error) {
            console.error('Download error:', error);
            alert('Download failed. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    // Loading Screen Component
    const LoadingScreen = () => (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading Movie Details...</p>
        </div>
    );

    // Add a check for missing movie data
    if (!movie) {
        return (
            <div className="container">
                <button onClick={() => navigate(-1)} className="back-button-movie">
                    <ArrowLeft size={30} />
                </button>
                <div className="error-container">
                    <p className="error-text">Movie data not available</p>
                    <p className="error-subtext">Please go back and try again</p>
                </div>
            </div>
        );
    }

    // Show loading screen while data is being processed
    if (isLoading) {
        return <LoadingScreen />;
    }

    const goBack = () => {
        navigate(-1);
    }

    

    const movieHasDownload = hasDownloadLink();

    return (
        <div className={`container ${isTablet ? 'tablet-layout' : 'mobile-layout'}`}>
            {!isFullscreen && (
                <button onClick={goBack} className="back-button">
                    <ArrowLeft size={30} />
                </button>
            )}

            <div className="content-wrapper">
                {/* Tablet Backdrop Image */}
                <img
                    src={movie.backdropPath}
                    alt={movie.title}
                    className={`backdrop-image ${isTablet ? 'tablet-backdrop' : 'mobile-backdrop'}`}
                />

                {!isFullscreen && (
                    <div className="movie-details-container">
                        <h1 className="movie-title">{movie.title}</h1>

                        <div className="sub-details-container">
                            <div className="detail-group">
                                <span className="sub-detail">
                                    {formatReleaseYear(movie.releaseDate)}
                                </span>
                                <span className="separator">|</span>
                                <span className="sub-detail">
                                    {formatRuntime(movie.runtime)}
                                </span>
                                <span className="separator">|</span>
                                <Tv size={20} />
                                <span className="separator">|</span>
                                <Star size={16} />
                                <span className="sub-detail">
                                    {movie.ratings || 'N/A'}
                                </span>
                            </div>

                            <div className="detail-group">
                                <Speaker size={20} />
                                <span className="sub-detail">English</span>
                                <span className="separator">|</span>
                                <Subtitles size={20} />
                                <span className="sub-detail">EN</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="button-container">


                            <button
                                className={`download-button ${(!movieHasDownload || isDownloading) ? 'disabled' : ''}`}
                                onClick={handleDownload}
                                disabled={!movieHasDownload || isDownloading}
                            >
                                <Download size={20} />
                                <span className="button-text">
                                    {!movieHasDownload ? 'Coming Soon' :
                                        isDownloading ? 'Downloading...' : 'Download'}
                                </span>
                            </button>
                        </div>

                        {/* Download Progress */}
                        {isDownloading && downloadProgress > 0 && (
                            <div className="download-progress">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${downloadProgress}%` }}
                                    ></div>
                                </div>
                                <span className="progress-text">{downloadProgress}%</span>
                            </div>
                        )}

                        {/* Movie Details */}
                        <div className="details-container">
                            <p className="overview">
                                {movie.description || movie.overview || 'No description available.'}
                            </p>
                            <p className="genres-text">
                                <strong>Genre:</strong> {movie.genres?.join('  |  ') || 'N/A'}
                            </p>
                        </div>

                        {/* Similar Movies */}
                        {similarMoviesList.length > 0 && (
                            <div className="similar-movies-section">
                                <div className="similar-movies-header">
                                    <h2 className="similar-movies-title">Similar Movies</h2>
                                </div>
                                <SimilarMovies
                                    similarMoviesList={similarMoviesList}
                                    isTablet={isTablet}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}