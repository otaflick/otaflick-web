import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import '../../css/AnimeBanner.css';

// USE YOUR ACTUAL IMPORTS


import type { Anime } from '../../hooks/requestInstance';

interface AnimeBannerProps {
  animeList: Anime[];
  isTablet: boolean;
}

const AnimeBanner: React.FC<AnimeBannerProps> = ({ animeList,  isTablet }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter anime that have valid poster/backdrop images
  const filteredAnime = animeList.filter(anime =>
    anime.posterPath &&
    anime.posterPath.startsWith('http')
  );

  // Take only first 5 anime for banner
  const bannerAnime = filteredAnime.slice(0, 5);

  
  

  const handleBannerClick = (anime: Anime) => {
navigate(`/anime/${anime._id}`, { 
      state: { anime } 
    });  };

  const posterInfoButton = (anime: Anime, e: React.MouseEvent) => {
    e.stopPropagation();
navigate(`/anime/${anime._id}`, { 
      state: { anime } 
    });  };

  

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

  // Auto slide functionality
  useEffect(() => {
    if (bannerAnime.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerAnime.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerAnime.length]);

  // Don't render if no anime
  if (bannerAnime.length === 0) {
    return null;
  }

  return (
    <div className="anime-banner-container">
      <div className="banner-slider">
        {bannerAnime.map((anime, index) => (
          <div
            key={anime._id}
            className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
            onClick={() => handleBannerClick(anime)}
          >
            <div 
              className="banner-background"
              style={{
                backgroundImage: `url(${isTablet && anime.backdropPath ? anime.backdropPath : anime.posterPath})`
              }}
            />
            
            <div className="banner-overlay">
              <div className="banner-content">
                <h2 className="anime-title">{anime.name}</h2>
              </div>
              
              <div className="banner-controls">
                <button 
                  disabled={!hasAvailableEpisodes(anime)}
                >
                  <span className="play-text">
                    {hasAvailableEpisodes(anime) ? '' : 'Coming Soon'}
                  </span>
                </button>

                <button 
                  className="info-button"
                  onClick={(e) => posterInfoButton(anime, e)}
                >
                  <Info className="info-icon" />
                  <span className="info-text">Info</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

     
    </div>
  );
};

export default AnimeBanner;