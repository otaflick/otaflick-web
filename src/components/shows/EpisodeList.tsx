// src/components/shows/EpisodeList.tsx
import React from 'react';
import '../../css/EpisodeList.css';

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
  isDownloading: (id: string) => boolean;
}

// Update EpisodeListProps to include onPlayEpisode
interface EpisodeListProps {
  episodesList: Episode[];
  onDownloadEpisode: (episode: Episode) => void;
  isDownloading: (id: string) => boolean;
  onPlayEpisode?: (episodeID: string, episodeLink: string, episodeName: string) => void; // Add this
}

const EpisodeItem: React.FC<EpisodeItemProps> = ({ 
  episode, 
  onPlayEpisode, 
  onDownloadEpisode, 
  isDownloading 
}) => {
  const hasDownloadLink = episode.downloadLink && episode.downloadLink !== '';
  
  return (
    <div className="episode-container">
      <div className="episode-row">
        <div 
          className={`episode-poster-container ${!hasDownloadLink ? 'coming-soon' : ''}`}
          onClick={() => hasDownloadLink ? onPlayEpisode(episode._id, episode.downloadLink, episode.name) : undefined}
        >
          <div className="play-button-overlay">
            {hasDownloadLink ? (
              <div className="play-button">▶</div>
            ) : (
              <span className="coming-soon-text">Coming Soon</span>
            )}
          </div>
        </div>
        <div className="episode-details">
          <h3 className="episode-number">
            {`${episode.episode_number || 'N/A'}. ${episode.name}`}
          </h3>
          <p className="episode-runtime">
            {episode.runtime ? `${episode.runtime} min` : 'Runtime not available'}
          </p>
          
          {/* Download Button for each episode */}
          <button
            className={`download-episode-button ${
              !hasDownloadLink || isDownloading(episode._id) ? 'disabled' : ''
            }`}
            onClick={() => onDownloadEpisode(episode)}
            disabled={!hasDownloadLink || isDownloading(episode._id)}
          >
            <span className="download-icon">
              {isDownloading(episode._id) ? '⏳' : '📥'}
            </span>
            <span className="download-text">
              {!hasDownloadLink ? 'Coming Soon' : 
               isDownloading(episode._id) ? 'Downloading...' : 'Download'}
            </span>
          </button>
        </div>
      </div>
      <p className="episode-overview">
        {episode.overview || 'No description available.'}
      </p>
    </div>
  );
};

const EpisodeList: React.FC<EpisodeListProps> = ({ 
  episodesList, 
  onDownloadEpisode, 
  isDownloading,
  onPlayEpisode // Add this
}) => {
  // Use the provided onPlayEpisode or fallback to default
  const handlePlayEpisode = onPlayEpisode || ((episodeID: string, episodeLink: string, episodeName: string) => {
    try {
      if (!episodeLink || episodeLink === '') {
        alert("Episode not available");
        return;
      }
      
      console.log('Playing episode:', { episodeID, episodeLink, episodeName });
      
      if (episodeLink.startsWith('http')) {
        window.open(episodeLink, '_blank');
      } else {
        alert(`Would play: ${episodeName}`);
      }
      
    } catch (error) {
      console.error("Error playing episode:", error);
      alert("Error playing episode");
    }
  });

  if (!episodesList || episodesList.length === 0) {
    return (
      <div className="episode-list-container">
        <p className="no-episodes-text">No episodes available</p>
      </div>
    );
  }

  return (
    <div className="episode-list-container">
      <h2 className="episodes-section-title">Episodes</h2>
      {episodesList.map((episode) => (
        <EpisodeItem 
          key={episode._id}
          episode={episode} 
          onPlayEpisode={handlePlayEpisode} 
          onDownloadEpisode={onDownloadEpisode}
          isDownloading={isDownloading}
        />
      ))}
    </div>
  );
}

export default EpisodeList;