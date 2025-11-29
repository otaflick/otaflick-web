import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import EpisodeList from '../components/anime/EpisodeList';
import '../css/AnimeDetails.css';

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
  const startDownload = async (downloadData: {
    id: string;
    title: string;
    downloadLink: string;
    contentType: string;
    itemId: string;
    episodeId: string;
    seasonNumber: number;
    episodeNumber: string;
    posterPath?: string;
    backdropPath?: string;
    genres: string[];
    releaseDate: string;
    releaseYear: string;
    overview: string;
  }) => {
    try {
      // Add to downloading set
      setDownloadingEpisodes(prev => new Set(prev).add(downloadData.id));

      // Create a temporary anchor element for download
      const link = document.createElement('a');
      link.href = downloadData.downloadLink;
      link.download = `${downloadData.title}.mp4`;
      link.target = '_blank';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Simulate download completion after a delay
      setTimeout(() => {
        setDownloadingEpisodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(downloadData.id);
          return newSet;
        });
        alert(`Download started: ${downloadData.title}`);
      }, 2000);

    } catch (error) {
      console.error('Download error:', error);
      setDownloadingEpisodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(downloadData.id);
        return newSet;
      });
      alert('Download failed');
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
      <div className="show-details-container">
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

  // Show loading screen while data is being processed
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

  

  const handleDownloadEpisode = async (episode: Episode) => {
    try {
      if (!episode.downloadLink || episode.downloadLink === '') {
        alert('This episode is not available for download yet');
        return;
      }

      await startDownload({
        id: episode._id,
        title: `${animeData.name} - ${episode.name}`,
        downloadLink: episode.downloadLink,
        contentType: 'anime',
        itemId: animeData._id,
        episodeId: episode._id,
        seasonNumber: selectedSeasonIndex + 1,
        episodeNumber: episode.episode_number?.toString() || '1',
        posterPath: episode.poster || animeData.posterPath,
        backdropPath: animeData.backdropPath,
        genres: animeData.genres,
        releaseDate: animeData.releaseDate,
        releaseYear: new Date(animeData.releaseDate).getFullYear().toString(),
        overview: episode.overview || animeData.overview
      });
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed');
    }
  };

  

  // Safe access to seasons
  const seasons = animeData?.seasons || [];
  const selectedSeason = seasons[selectedSeasonIndex];
  const episodes = selectedSeason?.episodes || [];

  const animeHasEpisodes = hasAvailableEpisodes();

  return (
    <div className="show-details-container">
      <div className="show-details-content">
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
        <div className="show-details-container-inner">
          <div className="show-title">{animeData.name}</div>
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
          <button 
            className={`play-button ${!animeHasEpisodes ? 'coming-soon-button' : ''}`}
            disabled={!animeHasEpisodes}
          >
            <span className="play-button-text">
              {animeHasEpisodes ? 'Availble' : 'Coming Soon'}
            </span>
          </button>
          
          
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

        {/* Episode List */}
        {episodes.length > 0 && (
          <EpisodeList 
            episodesList={episodes} 
            onDownloadEpisode={handleDownloadEpisode}
            isDownloading={isDownloading}
            isTablet={false} 
          />
        )}
      </div>
    </div>
  );
}