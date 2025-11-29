import { useNavigate } from 'react-router-dom';
import React from 'react';
import '../../css/SearchAnimeList.css';
// Define types
export interface Anime {
  _id: string;
  name: string;
  posterPath: string;
  releaseDate: string;
  ratings: number;
  genres: string[];
  [key: string]: any;
}

interface SearchAnimeListProps {
  data: Anime[];
  isTablet?: boolean;
}

const SearchAnimeList: React.FC<SearchAnimeListProps> = ({ data, isTablet = false }) => {
  const navigate = useNavigate();

  const formatReleaseDate = (dateString: string): string => {
    try {
      const year = new Date(dateString).getFullYear();
      return isNaN(year) ? 'N/A' : year.toString();
    } catch (error) {
      return 'N/A';
    }
  };

  const handleAnimePress = (anime: Anime) => {
    navigate('/anime-details', { state: { anime } });
  };

  const renderItem = (item: Anime) => (
    <div className="anime-item" onClick={() => handleAnimePress(item)}>
      <div className="anime-container">
        <img 
          src={item.posterPath} 
          alt={item.name}
          className={`poster-image ${isTablet ? 'tablet-size' : 'mobile-size'}`}
        />
        <div className="anime-info">
          <div className={`anime-name ${isTablet ? 'tablet-text' : 'mobile-text'}`}>
            {item.name} ({formatReleaseDate(item.releaseDate)})
          </div>
          <div className={`anime-rating ${isTablet ? 'tablet-text' : 'mobile-text'}`}>
            ⭐ {item.ratings || 'N/A'}
          </div>
          <div className="genre-container">
            {item.genres?.slice(0, 3).map((genre, index) => (
              <span key={index} className="genre-item">
                <span className={`anime-genres ${isTablet ? 'tablet-text' : 'mobile-text'}`}>
                  {genre}
                </span>
              </span>
            ))}
            {item.genres && item.genres.length > 3 && (
              <span className="genre-item">
                <span className={`anime-genres ${isTablet ? 'tablet-text' : 'mobile-text'}`}>
                  +{item.genres.length - 3}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (!data || data.length === 0) {
    return (
      <div className="empty-container">
        <div className="empty-text">No anime found</div>
      </div>
    );
  }

  return (
    <div className="anime-list">
      {data.map((item) => (
        <React.Fragment key={item._id}>
          {renderItem(item)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SearchAnimeList;