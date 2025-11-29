import SearchAnimeList from '../components/anime/SearchAnimeList';
import { animeSearchAPI, getAllAnime } from '../hooks/requestInstance';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../css/AnimeSearchScreen.css';
import type { Anime } from '../components/anime/SearchAnimeList';
// Anime search screen
export default function AnimeSearchScreen() {
    const [searchText, setSearchText] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Anime[]>([]);
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkScreenSize = () => {
            setIsTablet(window.innerWidth >= 768);
        };

        const apiCall = async () => {
            try {
                setLoading(true);
                const anime = await getAllAnime();
                // Handle different response formats and transform data if needed
                let processedAnime: Anime[] = [];
                
                if (Array.isArray(anime)) {
                    processedAnime = anime.map(animeItem => ({
                        ...animeItem,
                        // Ensure the data matches the expected Anime interface
                        name: animeItem.name || animeItem.title || 'Unknown Anime',
                        ratings: animeItem.ratings || 0
                    }));
                } else if ((anime as any)?.anime) {
                    processedAnime = (anime as any).anime.map((animeItem: any) => ({
                        ...animeItem,
                        name: animeItem.name || animeItem.title || 'Unknown Anime',
                        ratings: animeItem.ratings || 0
                    }));
                }
                
                setAnimeList(processedAnime);
                checkScreenSize();
                
                // Add resize listener
                window.addEventListener('resize', checkScreenSize);
            } catch (error) {
                console.error("Error fetching anime:", error);
                setAnimeList([]);
            } finally {
                setLoading(false);
            }
        };

        apiCall();

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    const handleSearch = async (text: string) => {
        setSearchText(text);
        if (text.length > 0) {
            try {
                setSearchLoading(true);
                const results = await animeSearchAPI(text);
                // Handle different response formats and transform data
                let processedResults: Anime[] = [];
                
                if (Array.isArray(results)) {
                    processedResults = results.map(animeItem => ({
                        ...animeItem,
                        name: animeItem.name || animeItem.title || 'Unknown Anime',
                        ratings: animeItem.ratings || 0
                    }));
                } else if ((results as any)?.anime) {
                    processedResults = (results as any).anime.map((animeItem: any) => ({
                        ...animeItem,
                        name: animeItem.name || animeItem.title || 'Unknown Anime',
                        ratings: animeItem.ratings || 0
                    }));
                }
                
                setSearchResults(processedResults);
                console.log('Search Results:', processedResults);
            } catch (error) {
                console.error("Error searching anime:", error);
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        } else {
            // Clear the search results or handle accordingly
            setSearchResults([]);
            setSearchLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    if (loading) {
        return (
            <div className="container loading-container">
                <div className="loading-content">
                    <div className="spinner"></div>
                    <div className="loading-text">Loading anime...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Header with Back Button */}
            <div className="header">
                <button onClick={handleBack} className="back-button">
                    ←
                </button>
                <div className="header-title">Search Anime</div>
                <div className="placeholder" />
            </div>

            <div className="search-container">
                <input
                    placeholder="Search anime..."
                    className="search-input"
                    onChange={(e) => handleSearch(e.target.value)}
                    value={searchText}
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                />
            </div>

            <div className="scroll-view">
                {searchLoading ? (
                    <div className="loading-section">
                        <div className="small-spinner"></div>
                        <div className="loading-section-text">Searching...</div>
                    </div>
                ) : searchResults.length > 0 ? (
                    <div>
                        <div className="results-label">
                            Search Results ({searchResults.length})
                        </div>
                        <SearchAnimeList data={searchResults} isTablet={isTablet} />
                    </div>
                ) : searchText.length > 0 ? (
                    <div className="no-results-container">
                        <div className="sad-icon">😔</div>
                        <div className="no-results-text">No anime found for "{searchText}"</div>
                        <div className="no-results-subtitle">Try different keywords</div>
                    </div>
                ) : (
                    <div>
                        <div className="all-anime-label">
                            All Anime ({animeList.length})
                        </div>
                        {animeList.length > 0 ? (
                            <SearchAnimeList data={animeList} isTablet={isTablet} />
                        ) : (
                            <div className="no-anime-container">
                                <div className="sad-icon">😔</div>
                                <div className="no-anime-text">No anime available</div>
                                <div className="no-anime-subtitle">Check back later for new content</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}