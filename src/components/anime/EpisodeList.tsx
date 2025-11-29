import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Download } from 'lucide-react';
import '../../css/EpisodeListAnime.css';

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

interface EpisodeItemProps {
  episode: Episode;
  onPlayEpisode: (episodeID: string, episodeLink: string, episodeName: string) => void;
  onDownloadEpisode: (episode: Episode) => void;
  isTabletValue: boolean;
  isDownloading: (id: string) => boolean;
}

interface EpisodeListProps {
  episodesList: Episode[];
  isTablet: boolean;
  onDownloadEpisode: (episode: Episode) => void;
  isDownloading: (id: string) => boolean;
}

const EpisodeItem: React.FC<EpisodeItemProps> = ({ 
  episode, 
  onPlayEpisode, 
  onDownloadEpisode, 
  isTabletValue, 
  isDownloading 
}) => {
  const hasDownloadLink = episode.downloadLink && episode.downloadLink !== '';
  
  return (
    <div className="episode-container">
      <div className="row-container">
        <button 
          onClick={() => hasDownloadLink ? onPlayEpisode(episode._id, episode.downloadLink, episode.name) : undefined}
          className={`episode-poster-button ${!hasDownloadLink ? 'coming-soon' : ''}`}
          disabled={!hasDownloadLink}
        >
          <img 
            src={episode.poster} 
            alt={episode.name}
            className={`poster ${isTabletValue ? 'tablet-poster' : 'mobile-poster'}`}
          />
          <div className="play-button-container">
            {hasDownloadLink ? (
              <Play className="play-button" size={30} color="white" />
            ) : (
              <span className="coming-soon-text">Coming Soon</span>
            )}
          </div>
        </button>
        <div className="episode-details">
          <div className={`episode-number ${isTabletValue ? 'tablet-text' : 'mobile-text'}`}>
            {`${episode.episode_number || 'N/A'}. ${episode.name}`}
          </div>
          <div className={`episode-name ${isTabletValue ? 'tablet-text' : 'mobile-text'}`}>
          </div>
          
          {/* Download Button for each episode */}
          <button
            className={`download-episode-button ${(!hasDownloadLink || isDownloading(episode._id)) ? 'download-button-disabled' : ''}`}
            onClick={() => onDownloadEpisode(episode)}
            disabled={!hasDownloadLink || isDownloading(episode._id)}
          >
            <Download 
              size={14} 
              color={hasDownloadLink ? "white" : "#999"} 
            />
            <span className={`download-episode-text ${!hasDownloadLink ? 'coming-soon-download-text' : ''}`}>
              {!hasDownloadLink ? 'Coming Soon' : 
               isDownloading(episode._id) ? 'Downloading...' : 'Download'}
            </span>
          </button>
        </div>
      </div>
      <div className={`episode-overview ${isTabletValue ? 'tablet-text' : 'mobile-text'}`}>
        {episode.overview || 'No description available.'}
      </div>
    </div>
  );
};

const EpisodeList: React.FC<EpisodeListProps> = ({ 
  episodesList, 
  isTablet, 
  onDownloadEpisode, 
  isDownloading 
}) => {
  const navigate = useNavigate();

  const playEpisode = async (episodeID: string, episodeLink: string, episodeName: string) => {
    try {
      if (!episodeLink || episodeLink === '') {
        alert("Episode not available");
        return;
      }
      
      // For web, use the direct link (no AsyncStorage needed)
      const finalEpisodeLink = episodeLink;

      navigate('/anime-player', {
        state: { 
          episodeID, 
          episodeLink: finalEpisodeLink, 
          episodeName 
        }
      });
    } catch (error) {
      console.error("Error playing episode:", error);
      alert("Error playing episode");
    }
  };

  if (!episodesList || episodesList.length === 0) {
    return (
      <div className="container">
        <div className="no-episodes-text">No episodes available</div>
      </div>
    );
  }

  return (
    <div className="container">
      {episodesList.map((item) => (
        <EpisodeItem 
          key={item._id}
          episode={item} 
          onPlayEpisode={playEpisode} 
          onDownloadEpisode={onDownloadEpisode}
          isTabletValue={isTablet} 
          isDownloading={isDownloading}
        />
      ))}
    </div>
  );
}

export default EpisodeList;