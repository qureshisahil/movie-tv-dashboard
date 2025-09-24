import React, { useState, useEffect } from 'react';
import { Play, List } from 'lucide-react';
import './App.css';

import { tmdbApi } from './services/tmdbApi';
import { genreMap } from './utils/helpers';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import ErrorDisplay from './components/ErrorDisplay';
import DetailsModal from './components/DetailsModal';
import AdvancedFilters from './components/AdvancedFilters';
import { SkeletonGrid } from './components/SkeletonCard';
import AISuggestion from './components/AISuggestion';

function App() {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [movieData, setMovieData] = useState({ discover: [], trending: [], topRated: [], search: [] });
  const [aiResults, setAiResults] = useState([]);
  const [isAiSearch, setIsAiSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [selectedItem, setSelectedItem] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  
  // Filter states
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    if (!searchTerm && !isAiSearch) {
      if (activeTab === 'discover') {
        loadDiscoverData();
      } else if (activeTab === 'trending' || activeTab === 'topRated') {
        loadStaticData(activeTab);
      }
    }
  }, [activeTab, selectedGenre, sortBy, searchTerm, isAiSearch]);

  const loadStaticData = async (tab) => {
    if (movieData[tab]?.length > 0) return; // Don't refetch if data exists
    setLoading(true);
    setError(null);
    try {
      const fetchFunction = tab === 'trending' ? tmdbApi.getTrending : tmdbApi.getTopRatedMovies;
      const response = await fetchFunction();
      setMovieData(prev => ({ ...prev, [tab]: response.results || [] }));
    } catch (err) {
      setError('Failed to load data. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const loadDiscoverData = async () => {
    setLoading(true);
    setError(null);
    try {
      const discoverRes = await tmdbApi.discover({ genreId: selectedGenre, sortBy });
      setMovieData(prev => ({
        ...prev,
        discover: discoverRes.results.map(item => ({...item, media_type: 'movie'})) || [],
      }));
    } catch (err) {
      setError('Failed to load data. Please check your filters.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadStaticData('trending');
    loadStaticData('topRated');
  }, []);

  const searchMovies = async (query) => {
    if (!query.trim()) {
      setMovieData(prev => ({ ...prev, search: [] }));
      return;
    }
    setLoading(true);
    setIsAiSearch(false);
    try {
      const searchRes = await tmdbApi.searchMulti(query);
      setMovieData(prev => ({ ...prev, search: searchRes.results || [] }));
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchMovies(searchTerm);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleAiSearch = async (keywords) => {
    if (!keywords || keywords.length === 0) return;
    setLoading(true);
    setIsAiSearch(true);
    setSearchTerm('');
    try {
      const searchPromises = keywords.map(keyword => tmdbApi.searchMulti(keyword));
      const searchResults = await Promise.all(searchPromises);
      const combined = searchResults.flatMap(res => res.results);
      const uniqueResults = Array.from(new Map(combined.map(item => [item.id, item])).values())
        .sort((a, b) => b.popularity - a.popularity);
      setAiResults(uniqueResults);
    } catch (err) {
      setError('AI search failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const toggleWatchlist = (id) => {
    setWatchlist(prev => 
      prev.includes(id) ? prev.filter(watch => watch !== id) : [...prev, id]
    );
  };

  const getFilteredData = () => {
    if (isAiSearch) return aiResults;
    if (searchTerm) return movieData.search;
    
    if (activeTab === 'myLists') {
      const allSavedIds = [...new Set([...favorites, ...watchlist])];
      const allKnownItems = [
        ...movieData.discover, 
        ...movieData.trending, 
        ...movieData.topRated,
        ...movieData.search,
        ...aiResults
      ];
      return allSavedIds.map(id => allKnownItems.find(item => item && item.id === id)).filter(Boolean);
    }
    return movieData[activeTab] || [];
  };

  const handleCardClick = async (item) => {
    if (!item || !item.id) return;
    setSelectedItem(item);
    setDetailsLoading(true);
    try {
      const mediaType = item.media_type === 'tv' ? 'tv' : 'movie';
      const detailsData = mediaType === 'movie'
        ? await tmdbApi.getMovieDetails(item.id)
        : await tmdbApi.getTVDetails(item.id);
      setDetails(detailsData);
    } catch (err) {
      console.error("Failed to fetch details", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
    setDetails(null);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    setIsAiSearch(false);
    setAiResults([]);
    setActiveTab('discover'); // Go back to discover tab
  };
  
  const handleLogoClick = () => {
    setActiveTab('discover');
    clearSearch();
  };

  const currentData = getFilteredData();

  if (error && !selectedItem) {
    return <ErrorDisplay error={error} onRetry={loadDiscoverData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-200">
      <header className="sticky top-0 z-40 bg-slate-900/70 backdrop-blur-lg border-b border-slate-800">
        <div className="p-4 text-center">
          <button onClick={handleLogoClick} className="focus:outline-none">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Binge It!
            </h1>
          </button>
          <p className="text-gray-500 text-sm">
            Discover your next favorite movie or TV show.
          </p>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex bg-white/5 backdrop-blur-xl rounded-lg p-1 border border-white/10">
              {['discover', 'trending', 'topRated', 'myLists'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    clearSearch();
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize flex items-center gap-2 ${
                    activeTab === tab && !searchTerm && !isAiSearch
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab === 'myLists' && <List size={16} />}
                  {tab === 'myLists' ? 'My Lists' : tab === 'topRated' ? 'Top Rated' : tab}
                </button>
              ))}
            </div>

            {activeTab !== 'myLists' && (
              <SearchBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                loading={loading && !!searchTerm}
              />
            )}
          </div>

          {(isAiSearch || searchTerm) ? (
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Search Results</h2>
              </div>
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-purple-600/50 hover:bg-purple-600 text-white rounded-lg text-sm"
              >
                Clear
              </button>
            </div>
          ) : activeTab === 'discover' ? (
            <>
              <AISuggestion onSearch={handleAiSearch} />
              <AdvancedFilters
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </>
          ) : activeTab === 'myLists' && (
             <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Your Saved Items</h2>
              <p className="text-gray-400">
                All your favorites and items on your watchlist appear here.
              </p>
            </div>
          )}

          {loading ? (
            <SkeletonGrid />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentData.map((item) => (
                item && <MovieCard
                  key={item.id}
                  item={item}
                  favorites={favorites}
                  watchlist={watchlist}
                  toggleFavorite={toggleFavorite}
                  toggleWatchlist={toggleWatchlist}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>
          )}

          {!loading && currentData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-indigo-400 text-6xl mb-4">🎬</div>
              <h3 className="text-white text-xl font-semibold mb-2">No results found</h3>
              <p className="text-gray-400">
                {activeTab === 'myLists' 
                  ? "You haven't saved any items yet."
                  : (searchTerm || isAiSearch) 
                    ? 'Try a different search.' 
                    : 'Try adjusting your filters or switching tabs.'
                }
              </p>
            </div>
          )}
        </div>
      </main>
      
      {selectedItem && (
        <DetailsModal
          item={selectedItem}
          details={details}
          loading={detailsLoading}
          onClose={handleCloseDetails}
          onCardClick={handleCardClick}
        />
      )}
    </div>
  );
}

export default App;