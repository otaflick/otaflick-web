import { useNavigate } from 'react-router-dom';
import '../../css/SimilarMovies.css';


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

interface SimilarMoviesProps {
  similarMoviesList: Movie[];
  isTablet: boolean;
}

const SimilarMovies = ({ similarMoviesList }: SimilarMoviesProps) => {
    const navigate = useNavigate();

    // Check if movie has download link
    const hasDownloadLink = (movie: Movie): boolean => {
        return !!(movie.downloadLink && movie.downloadLink !== '');
    };

    const handleSimilarMovies = (selectedSimilarMovie: Movie) => {
        navigate(`/movie/${selectedSimilarMovie._id}`, { 
            state: { movie: selectedSimilarMovie } 
        });
    }

    // Fisher-Yates Shuffle Algorithm
    const shuffleArray = (array: any[]) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const shuffledSimilarMoviesList = shuffleArray(similarMoviesList).slice(0, 8);

    return (
        <div className="similar-movies-container">
            <div className="movies-grid">
                {shuffledSimilarMoviesList.map((movie) => {
                    const hasDownload = hasDownloadLink(movie);
                    
                    return (
                        <div
                            key={movie._id}
                            className="movie-card"
                            onClick={() => handleSimilarMovies(movie)}
                        >
                            <div className="movie-poster-container">
                                <img 
                                    src={movie.posterPath} 
                                    alt={movie.title}
                                    className={`movie-poster ${!hasDownload ? 'coming-soon' : ''}`}
                                />
                                {!hasDownload && (
                                    <div className="coming-soon-overlay">
                                        <span className="coming-soon-text">Coming Soon</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SimilarMovies;