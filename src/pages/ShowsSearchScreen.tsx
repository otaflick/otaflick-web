import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchShowList from '../components/shows/SearchShowList';
import { getAllShows, showsSearchAPI } from '../hooks/requestInstance';
import '../css/ShowsSearchScreen.css';
import type { Show } from '../components/shows/SearchShowList';

export default function ShowsSearchScreen() {
    const [searchText, setSearchText] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Show[]>([]);
    const [showsList, setShowsList] = useState<Show[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const apiCall = async () => {
            try {
                setLoading(true);
                const shows = await getAllShows();
                // Handle different response formats and transform data if needed
                let processedShows: Show[] = [];
                
                if (Array.isArray(shows)) {
                    processedShows = shows.map(show => ({
                        ...show,
                        // Ensure the data matches the expected Show interface
                        name: show.name || show.title || 'Unknown Show',
                        ratings: show.ratings || 0
                    }));
                } else if ((shows as any)?.shows) {
                    processedShows = (shows as any).shows.map((show: any) => ({
                        ...show,
                        name: show.name || show.title || 'Unknown Show',
                        ratings: show.ratings || 0
                    }));
                }
                
                setShowsList(processedShows);
            } catch (error) {
                console.error("Error fetching shows:", error);
                setShowsList([]);
            } finally {
                setLoading(false);
            }
        };

        apiCall();
    }, []);

    const handleSearch = async (text: string) => {
        setSearchText(text);
        if (text.length > 0) {
            try {
                setSearchLoading(true);
                const results = await showsSearchAPI(text);
                // Handle different response formats and transform data
                let processedResults: Show[] = [];
                
                if (Array.isArray(results)) {
                    processedResults = results.map(show => ({
                        ...show,
                        name: show.name || show.title || 'Unknown Show',
                        ratings: show.ratings || 0
                    }));
                } else if ((results as any)?.shows) {
                    processedResults = (results as any).shows.map((show: any) => ({
                        ...show,
                        name: show.name || show.title || 'Unknown Show',
                        ratings: show.ratings || 0
                    }));
                }
                
                setSearchResults(processedResults);
                console.log('Search Results:', processedResults);
            } catch (error) {
                console.error("Error searching shows:", error);
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
        navigate(-1);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(searchText);
        }
    };

    if (loading) {
        return (
            <div className="shows-search-container loading">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <div className="loading-text">Loading shows...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="shows-search-container">
            {/* Header with Back Button */}
            <header className="search-header">
                <button onClick={handleBack} className="back-button">
                    <span className="back-arrow">←</span>
                </button>
                <h1 className="header-title">Search Shows</h1>
                <div className="header-placeholder" />
            </header>

            <div className="search-input-container">
                <input
                    type="text"
                    placeholder="Search shows..."
                    className="search-input"
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyPress={handleKeyPress}
                    value={searchText}
                    autoCapitalize="none"
                    autoCorrect="off"
                />
            </div>

            <main className="search-content">
                {searchLoading ? (
                    <div className="loading-section">
                        <div className="loading-spinner small"></div>
                        <div className="loading-section-text">Searching...</div>
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="search-results">
                        <h2 className="results-label">
                            Search Results ({searchResults.length})
                        </h2>
                        <SearchShowList data={searchResults} />
                    </div>
                ) : searchText.length > 0 ? (
                    <div className="no-results-container">
                        <div className="no-results-text">No shows found for "{searchText}"</div>
                        <div className="no-results-subtitle">Try different keywords</div>
                    </div>
                ) : (
                    <div className="all-shows-section">
                        <h2 className="all-shows-label">
                            All Shows ({showsList.length})
                        </h2>
                        {showsList.length > 0 ? (
                            <SearchShowList data={showsList} />
                        ) : (
                            <div className="no-shows-container">
                                <div className="no-shows-text">No shows available</div>
                                <div className="no-shows-subtitle">Check back later for new content</div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}