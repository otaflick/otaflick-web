import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/SearchShowList.css';

// Define types
export interface Show {
  _id: string;
  name: string;
  posterPath: string;
  releaseDate: string;
  ratings: number;
  genres: string[];
  [key: string]: any;
}

interface SearchShowListProps {
  data: Show[];
}

const SearchShowList: React.FC<SearchShowListProps> = ({ data }) => {
  const navigate = useNavigate();

  const formatReleaseDate = (dateString: string): string => {
    try {
      const year = new Date(dateString).getFullYear();
      return isNaN(year) ? 'N/A' : year.toString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const handleShowPress = (show: Show) => {
    navigate(`/show/${show._id}`, { 
      state: { show } 
  });  };



  if (!data || data.length === 0) {
    return (
      <div className="search-show-list-empty">
        <div className="empty-text">No shows found</div>
      </div>
    );
  }

  return (
    <div className="search-show-list">
      {data.map((item) => (
        <div 
          key={item._id} 
          className="show-item"
          onClick={() => handleShowPress(item)}
        >
          <div className="show-container">
            <img 
              src={item.posterPath} 
              alt={item.name}
              className="poster-image"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik04MCAxMjBDODAgMTE2LjY4NiA4Mi42ODYzIDExNCA4NiAxMTRDODkuMzEzNyAxMTQgOTIgMTE2LjY4NiA5MiAxMjBDOTIgMTIzLjMxNCA4OS4zMTM3IDEyNiA4NiAxMjZDODIuNjg2MyAxMjYgODAgMTIzLjMxNCA4MCAxMjBaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik02NiAxNjBDNjYgMTU2LjY4NiA2OC42ODYzIDE1NCA3MiAxNTRIMTAwQzEwMy4zMTQgMTU0IDEwNiAxNTYuNjg2IDEwNiAxNjBWMTYwSDEwNlYyMDBDMTA2IDIwMy4zMTQgMTAzLjMxNCAyMDYgMTAwIDIwNkg3MkM2OC42ODYzIDIwNiA2NiAyMDMuMzE0IDY2IDIwMFYxNjBaIiBmaWxsPSIjQ0NDQ0NDIi8+Cjwvc3ZnPgo=';
              }}
            />
            <div className="show-info">
              <h3 className="show-name">
                {item.name} ({formatReleaseDate(item.releaseDate)})
              </h3>
              <div className="show-rating">
                ⭐ {item.ratings || 'N/A'}
              </div>
              <div className="genre-container">
                {item.genres?.slice(0, 3).map((genre, index) => (
                  <span key={index} className="genre-item">
                    {genre}
                  </span>
                ))}
                {item.genres && item.genres.length > 3 && (
                  <span className="genre-item more-genres">
                    +{item.genres.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchShowList;