// src/components/shows/ShowsBanner.tsx
import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import type { Show } from '../../types/show';
import '../../css/ShowsBanner.css';

interface ShowsBannerProps {
  showsList: Show[];
  handleBanner: (show: Show) => void;
  posterInfoButton: (show: Show) => void;
  isTablet: boolean;
}

const ShowsBanner = ({ showsList, handleBanner, posterInfoButton, isTablet }: ShowsBannerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter shows that have valid poster/backdrop images
  const filteredShows = showsList.filter(show => 
    show && 
    ((show.posterPath && show.posterPath.startsWith('http')) || 
     (show.backdropPath && show.backdropPath.startsWith('http')))
  );

  // Take only first 5 shows for banner
  const bannerShows = filteredShows.slice(0, 5);

  // Auto slide functionality
  useEffect(() => {
    if (bannerShows.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerShows.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerShows.length]);

  const handleInfoClick = (show: Show, e: React.MouseEvent) => {
    e.stopPropagation();
    posterInfoButton(show);
  };

  const handleBannerClick = (show: Show) => {
    handleBanner(show);
  };

  // Don't render if no shows
  if (bannerShows.length === 0) {
    return null;
  }

  return (
    <div className="shows-banner-container">
      <div className="banner-slider">
        {bannerShows.map((show, index) => (
          <div
            key={show._id}
            className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
            onClick={() => handleBannerClick(show)}
          >
            <div 
              className="banner-background"
              style={{
                backgroundImage: `url(${isTablet && show.backdropPath ? show.backdropPath : show.posterPath})`
              }}
            />
            
            <div className="banner-overlay">
              <div className="banner-content">
                <h2 className="show-title">{show.name}</h2>
              </div>
              
              <div className="banner-controls">
                <button 
                  className="info-button"
                  onClick={(e) => handleInfoClick(show, e)}
                >
                  <Info className="info-icon" />
                  <span className="info-text">Info</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide indicators */}
      {/* {bannerShows.length > 1 && (
        <div className="slide-indicators">
          {bannerShows.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      )} */}
    </div>
  );
};

export default ShowsBanner;