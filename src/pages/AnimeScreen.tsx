import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Frown } from 'lucide-react';

import AnimeBanner from '../components/anime/AnimeBanner';
import AnimeCard from '../components/anime/AnimeCard';

import {
  getAllAnime,
  getAllAnimeGenres,
  getLatestReleasedAnime,
  getRecentAddedAnime
} from '../hooks/requestInstance';
import type { Anime } from '../hooks/requestInstance';

// KEEP ALL YOUR INTERFACES
interface AnimeResponse {
  anime?: Anime[];
  success?: boolean;
  message?: string;
}

interface GenresResponse {
  genres?: string[];
  success?: boolean;
  message?: string;
}





export default function AnimeScreen() {
  // Remove unused state variables
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [recentAddedAnime, setRecentAddedAnime] = useState<Anime[]>([])
  const [latestReleasedAnime, setLatestReleasedAnime] = useState<Anime[]>([])
  const [allGenres, setAllGenres] = useState<string[]>([]);
  // Remove watchedAnimeList since it's not used
  const [isTablet, setIsTablet] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  // Remove refreshing since it's not used
  
  const navigate = useNavigate();

  const fetchAllData = async () => {
    try {
      const [
        anime, 
        recentAnime, 
        latestReleased, 
        genres, 
      ] = await Promise.all([
        getAllAnime(),
        getRecentAddedAnime(),
        getLatestReleasedAnime(),
        getAllAnimeGenres(),
      ]);
      
      const processedAnime = Array.isArray(anime) ? anime : (anime as AnimeResponse)?.anime || [];
      const processedRecent = (recentAnime as AnimeResponse)?.anime || [];
      const processedLatest = Array.isArray(latestReleased) ? latestReleased : (latestReleased as AnimeResponse)?.anime || [];
      // Remove processedWatched since it's not used
      const processedGenres = Array.isArray(genres) ? genres : (genres as GenresResponse)?.genres || [];
      
      setAnimeList(processedAnime)
      setRecentAddedAnime(processedRecent)
      setLatestReleasedAnime(processedLatest)
      setAllGenres(processedGenres)
      
      // Tablet detection for web
      if (typeof window !== 'undefined') {
        setIsTablet(window.innerWidth >= 768)
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAllData();
      setLoading(false);
    };

    loadData();
  }, [])

  // Remove onRefresh function since it's not used

 
  
  const handleAnimeDetails = (anime: Anime) => {
    navigate('/anime-details', { 
      state: { anime } 
    });
  };

  const handleSearchPress = () => {
    navigate('/anime-search');
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading Anime...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      
      {/* Search Button - Top Right */}
      <button 
        className="search-button"
        onClick={handleSearchPress}
      >
        <div className="search-button-content">
          <Search size={20} color="#FFFFFF" />
          <span className="search-button-text">Search Anime</span>
        </div>
        <div className="search-button-glow" />
      </button>

      <div className="scroll-view">
        <div className="scroll-content">
          {animeList.length > 0 && (
            <AnimeBanner 
              animeList={animeList} 
              isTablet={isTablet} 
            />
          )}

          {recentAddedAnime.length > 0 && (
            <AnimeCard
              key="recent"
              genre="Recently Added"
              animeList={recentAddedAnime}
              handleAnimeDetails={handleAnimeDetails}
              isTablet={isTablet}
            />
          )}

          {latestReleasedAnime.length > 0 && (
            <AnimeCard
              key="latest"
              genre="Latest Released"
              animeList={latestReleasedAnime}
              handleAnimeDetails={handleAnimeDetails}
              isTablet={isTablet}
            />
          )}

          {allGenres.length > 0 && animeList.length > 0 && allGenres.map((genre) => (
            <AnimeCard 
              key={genre} 
              genre={genre} 
              animeList={animeList} 
              handleAnimeDetails={handleAnimeDetails} 
              isTablet={isTablet} 
            />
          ))}

          {/* Empty state handling */}
          {animeList.length === 0 && !loading && (
            <div className="empty-container">
              <Frown size={64} color="#CCCCCC" />
              <div className="empty-text">No anime found</div>
              <div className="empty-sub-text">Pull down to refresh</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}