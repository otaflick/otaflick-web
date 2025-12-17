// src/pages/ShowsScreen.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import ShowsBanner from '../components/shows/ShowsBanner';
import ShowCard from '../components/shows/ShowCard';
import {
  getAllShows,
  getAllShowsGenres,
  getLatestReleasedShows,
  getRecentAddedShows,
} from '../hooks/requestInstance';
import type { Show, ShowsResponse, GenresResponse } from '../types/show';
import '../css/ShowsScreen.css';

export default function ShowsScreen() {
  const [showsList, setShowsList] = useState<Show[]>([]);
  const [recentAddedShows, setRecentAddedShows] = useState<Show[]>([]);
  const [latestReleasedShows, setLatestReleasedShows] = useState<Show[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  // Handle responsive screen size
  useEffect(() => {
    const updateScreenSize = () => {
      setIsTablet(window.innerWidth >= 768);
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);

    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);

  // Function to transform API data to match Show interface
  const transformShowData = (show: any): Show => {
    return {
      _id: show._id || show.id || '',
      name: show.name || show.title || 'Unknown Show',
      backdropPath: show.backdropPath || show.backdrop || '',
      posterPath: show.posterPath || show.poster || '',
      releaseDate: show.releaseDate || show.release_date || '',
      ratings: show.ratings || show.rating || 0,
      overview: show.overview || show.description || '',
      genres: show.genres || [],
      seasons: show.seasons || []
    };
  };

  const fetchAllData = async () => {
    try {
      const [
        shows, 
        recentShows, 
        latestReleased, 
        genres
      ] = await Promise.all([
        getAllShows(),
        getRecentAddedShows(),
        getLatestReleasedShows(),
        getAllShowsGenres()
      ]);
      
      // Transform the data to match the expected Show interface
      const processedShows = Array.isArray(shows) 
        ? shows.map(transformShowData) 
        : (shows as ShowsResponse)?.shows?.map(transformShowData) || [];
      
      const processedRecent = Array.isArray(recentShows)
        ? recentShows.map(transformShowData)
        : (recentShows as ShowsResponse)?.shows?.map(transformShowData) || [];
      
      const processedLatest = Array.isArray(latestReleased)
        ? latestReleased.map(transformShowData)
        : (latestReleased as ShowsResponse)?.shows?.map(transformShowData) || [];
      
      const processedGenres = Array.isArray(genres) 
        ? genres 
        : (genres as GenresResponse)?.genres || [];
      
      setShowsList(processedShows);
      setRecentAddedShows(processedRecent);
      setLatestReleasedShows(processedLatest);
      setAllGenres(processedGenres);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAllData();
      setLoading(false);
    };

    loadData();
  }, []);

  const handleShowDetails = (show: Show) => {
    navigate(`/show/${show._id}`, { 
        state: { show } 
    });
};

  const handleSearchPress = () => {
    navigate('/show-search');
  };

  // Loading Screen Component
  const LoadingScreen = () => (
    <div className="shows-container">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading Shows...</p>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="shows-container">
      
      {/* Search Button - Top Right */}
      <button 
        className="search-button"
        onClick={handleSearchPress}
      >
        <div className="search-button-content">
          <Search size={20} color="#FFFFFF" />
          <span className="search-button-text">Search Shows</span>
        </div>
        <div className="search-button-glow" />
      </button>

      <div className="scroll-content">
        {showsList.length > 0 && (
          <ShowsBanner 
            showsList={showsList}
            isTablet={isTablet}
            handleBanner={handleShowDetails}
            posterInfoButton={handleShowDetails}
          />
        )}
        
        {recentAddedShows.length > 0 && (
          <ShowCard
            key="recent"
            genre="Recently Added"
            showsList={recentAddedShows}
            handleShowDetails={handleShowDetails}
            isTablet={isTablet}
          />
        )}

        {latestReleasedShows.length > 0 && (
          <ShowCard
            key="latest"
            genre="Latest Released"
            showsList={latestReleasedShows}
            handleShowDetails={handleShowDetails}
            isTablet={isTablet}
          />
        )}

        {allGenres.length > 0 && showsList.length > 0 && allGenres.map((genre) => (
          <ShowCard 
            key={genre} 
            genre={genre} 
            showsList={showsList} 
            handleShowDetails={handleShowDetails} 
            isTablet={isTablet} 
          />
        ))}

        {/* Empty state handling */}
        {showsList.length === 0 && !loading && (
          <div className="empty-container">
            <div className="empty-icon">😞</div>
            <p className="empty-text">No shows found</p>
            <p className="empty-subtext">Refresh the page to try again</p>
          </div>
        )}
      </div>
    </div>
  );
}