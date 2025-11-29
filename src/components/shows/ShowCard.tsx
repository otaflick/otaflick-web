// src/components/shows/ShowCard.tsx
import React from 'react';
import type { Show } from '../../types/show';
import '../../css/ShowCard.css';

interface ShowCardProps {
  genre: string;
  showsList: Show[];
  handleShowDetails: (show: Show) => void;
  isTablet: boolean;
}

const ShowCard: React.FC<ShowCardProps> = ({ genre, showsList, handleShowDetails, isTablet }) => {
  
  // Fisher-Yates Shuffle Algorithm
  const shuffleArray = (array: Show[]): Show[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Check if show has available episodes
  const hasAvailableEpisodes = (show: Show): boolean => {
    if (!show.seasons || show.seasons.length === 0) return false;
    
    for (const season of show.seasons) {
      for (const episode of season.episodes) {
        if (episode.downloadLink && episode.downloadLink !== '') {
          return true;
        }
      }
    }
    return false;
  };

  let filteredShows: Show[];

  if (genre === "Recently Added" || genre === "Latest Released") {
    filteredShows = showsList;
  } else {
    // Use optional chaining and provide fallback for genres
    filteredShows = shuffleArray(showsList.filter((show) => 
      show.genres?.includes(genre) ?? false
    ));
  }

  const renderShowCards = (item: Show) => {
    const hasEpisodes = hasAvailableEpisodes(item);
    
    return (
      <div 
        className={`show-card-container ${isTablet ? 'tablet' : 'mobile'}`}
        onClick={() => handleShowDetails(item)}
        key={item._id}
      >
        <img
          className={`show-card-image ${hasEpisodes ? '' : 'coming-soon'}`}
          src={item.posterPath}
          alt={item.name}
        />
        {!hasEpisodes && (
          <div className="coming-soon-overlay">
            <span className="coming-soon-text">Coming Soon</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`show-card-section ${isTablet ? 'tablet' : 'mobile'}`}>
      <h3 className="genre-label">{genre}</h3>
      <div className="shows-scroll-container">
        {filteredShows.map((item) => renderShowCards(item))}
      </div>
    </div>
  );
};

export default ShowCard;