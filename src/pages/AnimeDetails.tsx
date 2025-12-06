import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, X, Play } from 'lucide-react'; // ADD Play
import VideoPlayer from '../components/player/VideoPlayer'; // ADD THIS
import '../css/AnimeDetails.css';

// Define types
export interface Episode {
  _id: string;
  name: string;
  downloadLink: string; // This will be used for video playback too
  episode?: string;
  poster?: string;
  episode_number?: number;
  runtime?: number;
  overview?: string;
  [key: string]: any;
}

export interface Season {
  _id: string;
  season_number: number;
  episodes: Episode[];
  [key: string]: any;
}

export interface Anime {
  _id: string;
  name: string;
  backdropPath: string;
  posterPath: string;
  releaseDate: string;
  ratings: number;
  overview: string;
  genres: string[];
  seasons: Season[];
  type?: string;
  status?: string;
  [key: string]: any;
}

export default function AnimeDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { anime } = location.state || {};

  // Memoize the anime object to prevent recreation on every render
  const animeData = useMemo(() => anime || null, [anime]);

  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState<number>(0);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [downloadingEpisodes, setDownloadingEpisodes] = useState<Set<string>>(new Set());
  const [animeVideoPlayer, setanimeVideoPlayer] = useState(false); // ADD THIS
  const [isFullscreen, setIsFullscreen] = useState(false); // ADD THIS
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null); // ADD THIS

  // Use a ref to track if we've already fetched
  const hasFetched = React.useRef(false);

  useEffect(() => {
    // Skip if no anime, already fetched, or currently loading
    if (!animeData || hasFetched.current) {
      return;
    }

    const initializeData = async () => {
      hasFetched.current = true;
      setIsLoading(true);

      try {
        // Initialization logic here if needed
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [animeData]);

  // ADD THESE FUNCTIONS
  const handlePlayEpisode = (episode: Episode) => {
    if (!episode.downloadLink || episode.downloadLink === '') {
      alert("Video streaming not available for this episode!");
      return;
    }
    setSelectedEpisode(episode);
    setanimeVideoPlayer(true);
  };

  const handleCloseVideoPlayer = () => {
    setanimeVideoPlayer(false);
    setIsFullscreen(false);
    setSelectedEpisode(null);
  };

  const handleFullscreenToggle = (fullscreen: boolean) => {
    setIsFullscreen(fullscreen);
  };

  // Check if anime has any available episodes
  const hasAvailableEpisodes = (): boolean => {
    if (!animeData?.seasons || animeData.seasons.length === 0) return false;

    for (const season of animeData.seasons) {
      for (const episode of season.episodes) {
        if (episode.downloadLink && episode.downloadLink !== '') {
          return true;
        }
      }
    }
    return false;
  };

  // Check if episode is downloading
  const isDownloading = (id: string): boolean => {
    return downloadingEpisodes.has(id);
  };

  // Web download function
  const handleDownloadEpisode = async (episode: Episode) => {
    if (!episode.downloadLink || episode.downloadLink === '') {
      alert('This episode is not available for download yet');
      return;
    }
  
    setDownloadingEpisodes(prev => new Set(prev).add(episode._id));
  
    try {
      // 1. Create an iframe to load the video
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = episode.downloadLink;
      
      // 2. Create a hidden anchor element
      const link = document.createElement('a');
      link.href = episode.downloadLink;
      link.download = `${anime?.name || 'Episode'} - ${episode.name}.mp4`;
      link.style.display = 'none';
      
      // 3. Add both to document
      document.body.appendChild(iframe);
      document.body.appendChild(link);
      
      // 4. Try to trigger download
      link.click();
      
      // 5. Also try to download via iframe after it loads
      iframe.onload = () => {
        try {
          // Try to trigger download in iframe context
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            const iframeLink = iframeDoc.createElement('a');
            iframeLink.href = episode.downloadLink;
            iframeLink.download = `${anime?.name || 'Episode'} - ${episode.name}.mp4`;
            iframeDoc.body.appendChild(iframeLink);
            iframeLink.click();
          }
        } catch (e) {
          console.log('Iframe download attempt failed:', e);
        }
      };
      
      // 6. Clean up after 5 seconds
      setTimeout(() => {
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
        if (document.body.contains(link)) document.body.removeChild(link);
        
        setDownloadingEpisodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(episode._id);
          return newSet;
        });
      }, 5000);
      
    } catch (error) {
      console.error('Download failed:', error);
      
      // Final fallback
      setDownloadingEpisodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(episode._id);
        return newSet;
      });
      
      alert(`Right-click this link and select "Save link as":\n${episode.downloadLink}`);
    }
  };

  // Loading Screen Component
  const LoadingScreen = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-text">Loading Anime Details...</div>
    </div>
  );

  // Add a check for missing anime data
  if (!animeData) {
    return (
      <div className="anime-details-container">
        <button onClick={() => navigate(-1)} className="back-button-anime">
          <ArrowLeft size={24} />
        </button>
        <div className="error-container">
          <div className="error-text">Anime data not available</div>
          <div className="error-sub-text">Please go back and try again</div>
        </div>
      </div>
    );
  }

  // anime loading screen while data is being processed
  if (isLoading) {
    return <LoadingScreen />;
  }

  const goBack = () => {
    navigate(-1);
  };

  const openSeasonSelector = () => {
    setModalVisible(true);
  };

  const handleSeasonChange = (index: number) => {
    setSelectedSeasonIndex(index);
    setModalVisible(false);
  };

  // Safe access to seasons
  const seasons = animeData?.seasons || [];
  const selectedSeason = seasons[selectedSeasonIndex];
  const episodes = selectedSeason?.episodes || [];

  const animeHasEpisodes = hasAvailableEpisodes();

  return (
    <div className="anime-details-container">
      {/* Video Player Modal */}
      {animeVideoPlayer && selectedEpisode && (
        <div className={`video-player-overlay ${isFullscreen ? 'fullscreen' : ''}`}>
          <div className="video-player-header">
            <button onClick={handleCloseVideoPlayer} className="close-video-button">
              <X size={24} />
            </button>
            {!isFullscreen && animeData && (
              <h3 className="video-title">
                {animeData.name} - {selectedEpisode.name}
              </h3>
            )}
          </div>
          <div className="video-player-container">
            <VideoPlayer
              videoUri={selectedEpisode.downloadLink} // Use downloadLink as videoUri
              contentType="anime"
              onFullscreenToggle={handleFullscreenToggle}
              autoPlay={true}
              muted={false}
            />
          </div>
        </div>
      )}

      <div className="anime-details-content">
        {/* Season Selection Modal */}
        {seasons.length > 0 && isModalVisible && (
          <div className={`modal-overlay ${isModalVisible ? 'visible' : ''}`} onClick={() => setModalVisible(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">Select Season</div>
                <button className="modal-close-icon" onClick={() => setModalVisible(false)}>
                  <X size={24} />
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
                          Season {season.season_number}
                        </div>
                        <div className="episode-count">
                          {season.episodes.length} episodes
                        </div>
                      </div>
                      {selectedSeasonIndex === index && (
                        <Check size={20} color="#00C2FF" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <button onClick={goBack} className="back-button-anime">
          <ArrowLeft size={24} />
        </button>

        {/* Backdrop Image */}
        <img
          src={animeData.backdropPath}
          alt={animeData.name}
          className="backdrop-image"
        />

        {/* Anime Details */}
        <div className="anime-details-container-inner">
          <div className="anime-title">{animeData.name}</div>
          <div className="sub-details-container">
            <div className="sub-details">
              {new Date(animeData.releaseDate).getFullYear()} | HD | ⭐ {animeData.ratings}
            </div>
          </div>
          <div className="sub-details-container">
            <div className="sub-details">
              {animeData.type || 'Anime'} | {animeData.status || 'Ongoing'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="button-container">
          {animeHasEpisodes && (
            <button
              className="play-button"
              onClick={() => {
                if (episodes.length > 0 && episodes[0].downloadLink) {
                  handlePlayEpisode(episodes[0]);
                }
              }}
            >
              <Play size={20} />
              <span className="play-button-text">Play Episode 1</span>
            </button>
          )}
        </div>

        {/* Overview and Genres */}
        <div className="details-container">
          <div className="overview">
            {animeData.overview}
          </div>
          {animeData.genres && animeData.genres.length > 0 && (
            <div className="genres-text">
              Genre: {animeData.genres.join(' | ')}
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

        {/* Episode List - Update to include play button */}
        {episodes.length > 0 && (
          <div className="episode-list">
            {episodes.map((episode: Episode, index: number) => (
              <div key={episode._id} className="episode-item">
                <div className="episode-info">
                  <span className="episode-number">Ep {index + 1}</span>
                  <div className="episode-details">
                    <h4 className="episode-title">{episode.name}</h4>
                    {episode.overview && (
                      <p className="episode-description">{episode.overview}</p>
                    )}
                  </div>
                </div>
                <div className="episode-actions">
                  {episode.downloadLink && episode.downloadLink !== '' && (
                    <button
                      className="play-episode-btn"
                      onClick={() => handlePlayEpisode(episode)}
                      title="Play Episode"
                    >
                      <Play size={16} />
                      <span>Play</span>
                    </button>
                  )}
                  <button
                    className={`download-btn ${isDownloading(episode._id) ? 'downloading' : ''}`}
                    onClick={() => handleDownloadEpisode(episode)}
                    disabled={!episode.downloadLink || episode.downloadLink === ''}
                  >
                    {isDownloading(episode._id) ? 'Downloading...' : 'Download'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}