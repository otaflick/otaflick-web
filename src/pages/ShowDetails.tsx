import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/player/VideoPlayer';
import EpisodeList from '../components/shows/EpisodeList'; // Keep this import
import '../css/ShowDetails.css';
import { X } from 'lucide-react';

// Define types
export interface Episode {
  _id: string;
  name: string;
  downloadLink: string;
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
  
  const show = location.state?.show as Show | null;

  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState<number>(0);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [downloadingEpisodes, setDownloadingEpisodes] = useState<Set<string>>(new Set());
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  const hasFetched = useRef(false);

  const onBack = () => {
    navigate(-1);
  };

  // Update this function to work with EpisodeList
  const handlePlayEpisode = (episode: Episode) => {
    if (!episode.downloadLink || episode.downloadLink === '') {
      alert("Video streaming not available for this episode!");
      return;
    }
    setSelectedEpisode(episode);
    setShowVideoPlayer(true);
  };

  // Create a wrapper function for EpisodeList's onPlayEpisode
  const handleEpisodeListPlay = (episodeID: string, episodeLink: string, episodeName: string) => {
    // Find the episode from the episodes list
    const episodes = selectedSeason?.episodes || [];
    const episode = episodes.find(ep => ep._id === episodeID);
    
    if (episode) {
      handlePlayEpisode(episode);
    } else {
      // Fallback: create a temporary episode object
      handlePlayEpisode({
        _id: episodeID,
        name: episodeName,
        downloadLink: episodeLink
      });
    }
  };

  const handleCloseVideoPlayer = () => {
    setShowVideoPlayer(false);
    setIsFullscreen(false);
    setSelectedEpisode(null);
  };

  const handleFullscreenToggle = (fullscreen: boolean) => {
    setIsFullscreen(fullscreen);
  };

  useEffect(() => {
    if (!show || hasFetched.current) {
      setIsLoading(false);
      return;
    }

    const initializeData = async () => {
      hasFetched.current = true;
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
    };

    initializeData();
  }, [show]);

  const handleDownloadEpisode = async (episode: Episode) => {
    if (!episode.downloadLink || episode.downloadLink === '') {
      alert('This episode is not available for download yet');
      return;
    }
  
    setDownloadingEpisodes(prev => new Set(prev).add(episode._id));
  
    try {
      // Create a download link
      const link = document.createElement('a');
      link.href = episode.downloadLink;
      
      link.download = `${show?.name || 'Episode'} - ${episode.name}.mp4`;
      
      // Set target to _blank to open in new tab (better for large files)
      link.target = '_blank';
      
      // Append to body
      document.body.appendChild(link);
      
      // Trigger click
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      
      // Optional: You can show a success message
      console.log(`Download initiated: ${episode.name}`);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      // Reset downloading state after a delay
      setTimeout(() => {
        setDownloadingEpisodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(episode._id);
          return newSet;
        });
      }, 2000);
    }
  };

  const isDownloading = (id: string) => downloadingEpisodes.has(id);

  const LoadingScreen = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-text">Loading Show Details...</div>
    </div>
  );

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

  const seasons = show?.seasons || [];
  const selectedSeason = seasons[selectedSeasonIndex];
  const episodes = selectedSeason?.episodes || [];

  return (
    <div className="show-details-container">
      {/* Video Player Modal */}
      {showVideoPlayer && selectedEpisode && (
        <div className={`video-player-overlay ${isFullscreen ? 'fullscreen' : ''}`}>
          <div className="video-player-header">
            <button onClick={handleCloseVideoPlayer} className="close-video-button">
              <X size={24} />
            </button>
            {!isFullscreen && show && (
              <h3 className="video-title">
                {show.name} - {selectedEpisode.name}
              </h3>
            )}
          </div>
          <div className="video-player-container">
            <VideoPlayer
              videoUri={selectedEpisode.downloadLink}
              contentType="show"
              onFullscreenToggle={handleFullscreenToggle}
              autoPlay={true}
              muted={false}
            />
          </div>
        </div>
      )}

      <div className="show-details-content">
        {seasons.length > 0 && (
          <div className={`modal-overlay ${isModalVisible ? 'visible' : ''}`}>
            <div className="modal-container">
              <div className="modal-header">
                <div className="modal-title">Select Season</div>
                <button
                  className="modal-close-icon"
                  onClick={() => setModalVisible(false)}
                >
                  ×
                </button>
              </div>

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

        <img
          src={show.backdropPath}
          alt={show.name}
          className="backdrop-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-backdrop.jpg';
          }}
        />

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

        {seasons.length > 0 && (
          <button className="season-button-container" onClick={openSeasonSelector}>
            <div className="season-button">{`Season ${selectedSeasonIndex + 1}`}</div>
            <div className="season-button-icon">▼</div>
          </button>
        )}

        {/* Use EpisodeList component */}
        {episodes.length > 0 && (
          <EpisodeList
            episodesList={episodes}
            onDownloadEpisode={handleDownloadEpisode}
            isDownloading={isDownloading}
            onPlayEpisode={handleEpisodeListPlay} // Pass the play handler
          />
        )}
      </div>
    </div>
  );
}