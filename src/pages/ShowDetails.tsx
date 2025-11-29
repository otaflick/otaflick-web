// src/pages/ShowDetails.tsx
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/ShowDetails.css';
import EpisodeList from '../components/shows/EpisodeList';

// Define types
export interface Episode {
  _id: string;
  name: string;
  downloadLink: string;
  episode?: string;
  poster?: string;
  episode_number?: number;
  runtime?: number;
  overview?: string;
  [key: string]: any;
}

export interface Season {
  _id: string;
  seasonNumber: number;
  episodes: Episode[];
  [key: string]: any;
}

export interface Show {
  _id: string;
  name: string;
  backdropPath: string;
  posterPath: string;
  releaseDate: string;
  ratings: number;
  overview: string;
  genres: string[];
  seasons: Season[];
  [key: string]: any;
}

export default function ShowDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get show data from router state - it's already an object
  const show = location.state?.show as Show | null;

  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState<number>(0);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [downloadingEpisodes, setDownloadingEpisodes] = useState<Set<string>>(new Set());

  // Use a ref to track if we've already fetched
  const hasFetched = useRef(false);

  const onBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!show || hasFetched.current) {
      setIsLoading(false);
      return;
    }

    const initializeData = async () => {
      hasFetched.current = true;
      setIsLoading(true);
      // Simulate loading
      setTimeout(() => setIsLoading(false), 1000);
    };

    initializeData();
  }, [show]);

  // Real download function for browser
  const handleDownloadEpisode = async (episode: Episode) => {
    if (!episode.downloadLink || episode.downloadLink === '') {
      alert('This episode is not available for download yet');
      return;
    }

    // Add episode to downloading set
    setDownloadingEpisodes(prev => new Set(prev).add(episode._id));

    try {
      // For web downloads, we can create a temporary anchor element
      if (episode.downloadLink.startsWith('http')) {
        const link = document.createElement('a');
        link.href = episode.downloadLink;
        link.download = `${show?.name} - ${episode.name}.mp4` || 'episode.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert(`Download started: ${episode.name}`);
      } else {
        // If it's not a direct HTTP link, show a message
        alert(`Would download: ${episode.name}\nLink: ${episode.downloadLink}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      // Remove episode from downloading set after a delay
      setTimeout(() => {
        setDownloadingEpisodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(episode._id);
          return newSet;
        });
      }, 2000);
    }
  };

  // Check if an episode is currently downloading
  const isDownloading = (id: string) => downloadingEpisodes.has(id);

  // Loading Screen Component
  const LoadingScreen = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-text">Loading Show Details...</div>
    </div>
  );

  // Add a check for missing show data
  if (!show) {
    return (
      <div className="container">
        <button onClick={onBack} className="back-button">
          ← Back
        </button>
        <div className="error-container">
          <div className="error-text">Show data not available</div>
          <div className="error-sub-text">Please go back and try again</div>
        </div>
      </div>
    );
  }

  // Show loading screen while data is being processed
  if (isLoading) {
    return <LoadingScreen />;
  }

  const openSeasonSelector = () => {
    setModalVisible(true);
  };

  const handleSeasonChange = (index: number) => {
    setSelectedSeasonIndex(index);
    setModalVisible(false);
  };

  // Safe access to seasons
  const seasons = show?.seasons || [];
  const selectedSeason = seasons[selectedSeasonIndex];
  const episodes = selectedSeason?.episodes || [];

  return (
    <div className="show-details-container">
      <div className="show-details-content">
        {seasons.length > 0 && (
          <div className={`modal-overlay ${isModalVisible ? 'visible' : ''}`}>
            <div className="modal-container">
              {/* Modal Header */}
              <div className="modal-header">
                <div className="modal-title">Select Season</div>
                <button
                  className="modal-close-icon"
                  onClick={() => setModalVisible(false)}
                >
                  ×
                </button>
              </div>

              {/* Seasons List */}
              <div className="modal-list-content">
                {seasons.map((season: Season, index: number) => (
                  <div
                    key={index}
                    className={`modal-item ${selectedSeasonIndex === index ? 'selected' : ''}`}
                    onClick={() => handleSeasonChange(index)}
                  >
                    <div className="modal-item-content">
                      <div className="season-info">
                        <div className="modal-item-text">
                          Season {index + 1}
                        </div>
                        <div className="episode-count">
                          {season.episodes.length} episodes
                        </div>
                      </div>
                      {selectedSeasonIndex === index && (
                        <div className="checkmark">✓</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <button onClick={onBack} className="back-button">
          ←
        </button>

        {/* Show Backdrop Image */}
        <img
          src={show.backdropPath}
          alt={show.name}
          className="backdrop-image"
          onError={(e) => {
            // Fallback if backdrop image fails to load
            (e.target as HTMLImageElement).src = '/placeholder-backdrop.jpg';
          }}
        />

        {/* Show Details */}
        <div className="show-details-container-inner">
          <div className="show-title">{show.name}</div>
          <div className="sub-details-container">
            <div className="sub-details">
              {new Date(show.releaseDate).getFullYear()}   |
            </div>
            <div className="sub-details"> HD   |    ⭐ {show.ratings}</div>
          </div>
          <div className="sub-details-container">
            <div className="sub-details"> English  </div>
            <div className="sub-details">  EN Subtitles</div>
          </div>
        </div>

        {/* Overview and Genres */}
        <div className="details-container">
          <div className="overview">
            {show.overview}
          </div>
          {show.genres && show.genres.length > 0 && (
            <div className="genres-text">
              Genre: {show.genres.join('  |  ')}
            </div>
          )}
        </div>

        {/* Season Selector */}
        {seasons.length > 0 && (
          <button className="season-button-container" onClick={openSeasonSelector}>
            <div className="season-button">{`Season ${selectedSeasonIndex + 1}`}</div>
            <div className="season-button-icon">▼</div>
          </button>
        )}

        {/* Episode List - Using the imported EpisodeList component */}
        {episodes.length > 0 && (
          <EpisodeList 
            episodesList={episodes} 
            onDownloadEpisode={handleDownloadEpisode}
            isDownloading={isDownloading}
          />
        )}
      </div>
    </div>
  );
}