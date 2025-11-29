import React from 'react';
import '../../css/AnimeCard.css';
import type { Anime } from '../../hooks/requestInstance';

interface AnimeCardProps {
  genre: string;
  animeList: Anime[];
  handleAnimeDetails: (anime: Anime) => void;
  isTablet: boolean;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ genre, animeList, handleAnimeDetails }) => {
  
  // Calculate responsive font size based on screen width
  const getResponsiveFontSize = (size: number): number => {
    if (typeof window === 'undefined') return size;
    return (window.innerWidth / 400) * size;
  };

  // Fisher-Yates Shuffle Algorithm
  const shuffleArray = (array: Anime[]): Anime[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Check if anime has available episodes
  const hasAvailableEpisodes = (anime: Anime): boolean => {
    if (!anime.seasons || anime.seasons.length === 0) return false;
    
    for (const season of anime.seasons) {
      for (const episode of season.episodes) {
        if (episode.downloadLink && episode.downloadLink !== '') {
          return true;
        }
      }
    }
    return false;
  };

  let filteredAnime: Anime[];

  if (genre === "Recently Added" || genre === "Latest Released") {
    filteredAnime = animeList;
  } else {
    filteredAnime = shuffleArray(animeList.filter((anime) => anime.genres?.includes(genre)));
  }

  const renderAnimeCards = (item: Anime) => {
    const hasEpisodes = hasAvailableEpisodes(item);
    
    return (
      <div 
        key={item._id}
        className="anime-card-container"
        onClick={() => handleAnimeDetails(item)}
      >
        <img
          className={`anime-card-image ${!hasEpisodes ? 'coming-soon' : ''}`}
          src={item.posterPath}
          alt={item.name}
        />
        {!hasEpisodes && (
          <div className="coming-soon-overlay">
            <div className="coming-soon-text">Coming Soon</div>
          </div>
        )}
        <div className="anime-card-title">{item.name}</div>
      </div>
    );
  };

  return (
    <div className="anime-card-section">
      <div 
        className="section-label"
        style={{ fontSize: `${getResponsiveFontSize(16)}px` }}
      >
        {genre}
      </div>
      <div className="anime-grid">
        {filteredAnime.map(renderAnimeCards)}
      </div>
    </div>
  );
};

export default AnimeCard;