import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Check, X, Play } from 'lucide-react';
import VideoPlayer from '../components/player/VideoPlayer';
import '../css/AnimeDetails.css';
import { getAnimeById, type Anime as ApiAnime } from '../hooks/requestInstance';

// Define local Anime type that's compatible with your component
interface Anime {
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

export default function AnimeDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [anime, setAnime] = useState<Anime | null>(null);
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState<number>(0);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [downloadingEpisodes, setDownloadingEpisodes] = useState<Set<string>>(new Set());
  const [animeVideoPlayer, setAnimeVideoPlayer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  const hasFetched = useRef(false);

  const onBack = () => {
    navigate(-1);
  };

  const handlePlayEpisode = (episode: Episode) => {
    if (!episode.downloadLink || episode.downloadLink === '') {
      alert("Video streaming not available for this episode!");
      return;
    }
    setSelectedEpisode(episode);
    setAnimeVideoPlayer(true);
  };

  // Helper function to transform ApiAnime to our Anime type
  const transformToAnime = (apiAnime: ApiAnime | any): Anime => {
    return {
      _id: apiAnime._id,
      name: apiAnime.name || 'Unknown Anime',
      backdropPath: apiAnime.backdropPath || apiAnime.posterPath || '',
      posterPath: apiAnime.posterPath || '',
      releaseDate: apiAnime.releaseDate || '',
      ratings: apiAnime.ratings || 0,
      overview: apiAnime.overview || '',
      genres: apiAnime.genres || [],
      seasons: (apiAnime.seasons || []).map((apiSeason: any) => ({
        _id: apiSeason._id,
        seasonNumber: apiSeason.seasonNumber || 1,
        episodes: (apiSeason.episodes || []).map((apiEpisode: any) => ({
          _id: apiEpisode._id,
          name: apiEpisode.title || apiEpisode.name || 'Episode',
          downloadLink: apiEpisode.downloadLink || '',
          poster: apiEpisode.poster,
          episode_number: apiEpisode.episodeNumber || apiEpisode.episode_number,
          runtime: apiEpisode.runtime,
          overview: apiEpisode.overview
        }))
      })),
      type: apiAnime.type,
      status: apiAnime.status
    };
  };

  // FETCH ANIME DATA USING ID FROM URL
  useEffect(() => {
    const fetchAnimeData = async () => {
      setIsLoading(true);
      
      try {
        // Priority 1: Check if anime data came from navigation state
        if (location.state?.anime) {
          const animeData = location.state.anime;
          setAnime(transformToAnime(animeData));
          console.log("Using anime data from navigation state");
        }
        // Priority 2: Fetch anime by ID from URL (for direct links/refresh)
        else if (id) {
          console.log(`Fetching anime by ID from API: ${id}`);
          const animeData = await getAnimeById(id);
          
          if (animeData) {
            setAnime(transformToAnime(animeData));
          } else {
            console.error("Anime not found");
          }
        } else {
          console.error("No anime ID found in URL");
          return;
        }
      } catch (error) {
        console.error("Error fetching anime data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimeData();
  }, [id, location.state]);

  const handleCloseVideoPlayer = () => {
    setAnimeVideoPlayer(false);
    setIsFullscreen(false);
    setSelectedEpisode(null);
  };

  const handleFullscreenToggle = (fullscreen: boolean) => {
    setIsFullscreen(fullscreen);
  };

  // Optional: Additional initialization if needed
  useEffect(() => {
    if (!anime || hasFetched.current) {
      setIsLoading(false);
      return;
    }

    const initializeData = async () => {
      hasFetched.current = true;
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
    };

    initializeData();
  }, [anime]);

  const handleDownloadEpisode = async (episode: Episode) => {
    if (!episode.downloadLink || episode.downloadLink === '') {
      alert('This episode is not available for download yet');
      return;
    }
  
    setDownloadingEpisodes(prev => new Set(prev).add(episode._id));
  
    try {
      const link = document.createElement('a');
      link.href = episode.downloadLink;
      
      link.download = `${anime?.name || 'Episode'} - ${episode.name}.mp4`;
      
      link.target = '_blank';
      
      document.body.appendChild(link);
      
      link.click();
      
      document.body.removeChild(link);
      
      console.log(`Download initiated: ${episode.name}`);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
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
      <div className="loading-text">Loading Anime Details...</div>
    </div>
  );

  if (!anime) {
    return (
      <div className="anime-details-container">
        <button onClick={onBack} className="back-button-anime">
          <ArrowLeft size={24} />
        </button>
        <div className="error-container">
          <div className="error-text">Anime data not available</div>
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

  const seasons = anime?.seasons || [];
  const selectedSeason = seasons[selectedSeasonIndex];
  const episodes = selectedSeason?.episodes || [];

  return (
    <div className="anime-details-container">
      {/* Video Player Modal */}
      {animeVideoPlayer && selectedEpisode && (
        <div className={`video-player-overlay ${isFullscreen ? 'fullscreen' : ''}`}>
          <div className="video-player-header">
            <button onClick={handleCloseVideoPlayer} className="close-video-button">
              <X size={24} />
            </button>
            {!isFullscreen && anime && (
              <h3 className="video-title">
                {anime.name} - {selectedEpisode.name}
              </h3>
            )}
          </div>
          <div className="video-player-container">
            <VideoPlayer
              videoUri={selectedEpisode.downloadLink}
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
                        <Check size={20} color="#00C2FF" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <button onClick={onBack} className="back-button-anime">
          <ArrowLeft size={24} />
        </button>

        <img
          src={anime.backdropPath}
          alt={anime.name}
          className="backdrop-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-backdrop.jpg';
          }}
        />

        <div className="anime-details-container-inner">
          <div className="anime-title">{anime.name}</div>
          <div className="sub-details-container">
            <div className="sub-details">
              {new Date(anime.releaseDate).getFullYear()}   |
            </div>
            <div className="sub-details"> HD   |    ⭐ {anime.ratings}</div>
          </div>
          <div className="sub-details-container">
            <div className="sub-details"> {anime.type || 'Anime'}  </div>
            <div className="sub-details">  {anime.status || 'Status Unknown'}</div>
          </div>
        </div>

        <div className="details-container">
          <div className="overview">
            {anime.overview}
          </div>
          {anime.genres && anime.genres.length > 0 && (
            <div className="genres-text">
              Genre: {anime.genres.join('  |  ')}
            </div>
          )}
        </div>

        {seasons.length > 0 && (
          <button className="season-button-container" onClick={openSeasonSelector}>
            <div className="season-button">{`Season ${selectedSeasonIndex + 1}`}</div>
            <div className="season-button-icon">▼</div>
          </button>
        )}

        {/* Episode List */}
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