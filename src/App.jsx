import React, { useState, useEffect } from 'react';
import { Play, List, TrendingUp, Award, Search as SearchIcon, Sparkles } from 'lucide-react';
import './App.css';

import { tmdbApi } from './services/tmdbApi';
import { genreMap } from './utils/helpers';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import ErrorDisplay from './components/ErrorDisplay';
import DetailsModal from './components/DetailsModal';
import AdvancedFilters from './components/AdvancedFilters';
import AISuggestion from './components/AISuggestion';
import { SkeletonGrid } from './components/SkeletonCard';

function App() {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [movieData, setMovieData] = useState({ 
    discover: [], 
    trending: [], 
    topRated: [], 
    search: [],
    aiSuggestions: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [selectedItem, setSelectedItem] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  
  // Filter states
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [aiSuggestionLoading, setAiSuggestionLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'discover' && !searchTerm) {
      loadDiscoverData();
    } else if ((activeTab === 'trending' || activeTab === 'topRated') && !searchTerm) {
      loadStaticData(activeTab);
    }
  }, [activeTab, selectedGenre, sortBy, advancedFilters, searchTerm]);

  const loadStaticData = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      const fetchFunction = tab === 'trending' ? tmdbApi.getTrending : tmdbApi.getTopRatedMovies;
      const response = await fetchFunction();
      setMovieData(prev => ({ ...prev, [tab]: response.results || [] }));
    } catch (err) {
      setError('Failed to load data. Please check your API key.');
      console.error(`Error loading ${tab} data:`, err);
    } finally {
      setLoading(false);
    }
  };

  const loadDiscoverData = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {
        genreId: selectedGenre,
        sortBy,
        ...advancedFilters
      };
      
      const discoverRes = await tmdbApi.discover(filters);
      setMovieData(prev => ({
        ...prev,
        discover: discoverRes.results.map(item => ({...item, media_type: 'movie'})) || [],
      }));
    } catch (err) {
      setError('Failed to load data. Please check your filters.');
      console.error('Error loading discover data:', err);
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
    try {
      const searchRes = await tmdbApi.searchMulti(query);
      setMovieData(prev => ({
        ...prev,
        search: searchRes.results || []
      }));
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAISuggestion = async (description) => {
    setAiSuggestionLoading(true);
    setActiveTab('aiSuggestions');
    setSearchTerm('');
    try {
      const suggestions = await tmdbApi.suggestMoviesByDescription(description);
      setMovieData(prev => ({
        ...prev,
        aiSuggestions: suggestions.results || []
      }));
    } catch (err) {
      setError('AI suggestion failed. Please try a different description.');
      console.error('Error getting AI suggestions:', err);
    } finally {
      setAiSuggestionLoading(false);
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

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const toggleWatchlist = (id) => {
    setWatchlist(prev => 
      prev.includes(id) 
        ? prev.filter(watch => watch !== id)
        : [...prev, id]
    );
  };

  const getFilteredData = () => {
    if (searchTerm) {
      return movieData.search;
    }
    if (activeTab === 'myLists') {
      const allSavedIds = [...new Set([...favorites, ...watchlist])];
      const allKnownItems = [
        ...movieData.discover, 
        ...movieData.trending, 
        ...movieData.topRated,
        ...movieData.search,
        ...movieData.aiSuggestions
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

  const currentData = getFilteredData();

  const tabs = [
    { 
      key: 'discover', 
      label: 'Discover', 
      icon: SearchIcon, 
      description: 'Find new movies with advanced filters' 
    },
    { 
      key: 'trending', 
      label: 'Trending', 
      icon: TrendingUp, 
      description: 'What\'s popular right now' 
    },
    { 
      key: 'topRated', 
      label: 'Top Rated', 
      icon: Award, 
      description: 'Highest rated movies' 
    },
    { 
      key: 'aiSuggestions', 
      label: 'AI Picks', 
      icon: Sparkles, 
      description: 'AI-powered recommendations' 
    },
    { 
      key: 'myLists', 
      label: 'My Lists', 
      icon: List, 
      description: 'Your saved movies' 
    }
  ];

  if (error && !selectedItem) {
    return <ErrorDisplay error={error} onRetry={loadDiscoverData} />;
  }

  return (
    <div className="min-h-screen gradient-dark text-gray-200">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-blue-900/20"></div>
        <div className="relative p-8 text-center">
          <div className="animate-float">
            <h1 className="text-6xl md:text-7xl font-black text-gradient text-glow mb-4" 
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              CineVerse
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Discover your next cinematic obsession with AI-powered recommendations 
              and advanced filtering
            </p>
          </div>
          <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse-glow"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-12">
        {/* Navigation Tabs */}
        <div className="glass-morphism rounded-2xl p-2 mb-8 border border-white/10">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key && !searchTerm;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSearchTerm('');
                  }}
                  className={`group relative px-6 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 min-w-[140px] ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
                  <div className="text-left">
                    <div>{tab.label}</div>
                    <div className="text-xs opacity-75 font-normal">{tab.description}</div>
                  </div>
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse-glow"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar - Always visible except for My Lists */}
        {activeTab !== 'myLists' && (
          <div className="mb-8">
            <SearchBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              loading={loading && !!searchTerm}
            />
          </div>
        )}

        {/* AI Suggestion Component */}
        {activeTab === 'discover' && !searchTerm && (
          <AISuggestion 
            onSuggest={handleAISuggestion}
            loading={aiSuggestionLoading}
          />
        )}

        {/* Advanced Filters for Discover tab */}
        {activeTab === 'discover' && !searchTerm && (
          <AdvancedFilters
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filters={advancedFilters}
            onFilterChange={setAdvancedFilters}
          />
        )}

        {/* Section Headers */}
        {!searchTerm && (
          <div className="mb-8">
            {activeTab === 'myLists' && (
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-3">Your Collection</h2>
                <p className="text-gray-400 text-lg">
                  {currentData.length > 0 
                    ? `${currentData.length} saved ${currentData.length === 1 ? 'item' : 'items'}`
                    : "Start building your personal movie collection"
                  }
                </p>
              </div>
            )}
            {activeTab === 'aiSuggestions' && (
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                  AI Recommendations
                </h2>
                <p className="text-gray-400 text-lg">
                  {currentData.length > 0 
                    ? `Found ${currentData.length} perfect matches for you`
                    : "Use the AI suggestion tool above to get personalized recommendations"
                  }
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Loading State */}
        {(loading || aiSuggestionLoading) && currentData.length === 0 ? (
          <SkeletonGrid />
        ) : (
          /* Movie Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
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

        {/* Empty States */}
        {!loading && !aiSuggestionLoading && currentData.length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-float">
              {activeTab === 'myLists' ? '📚' : 
               activeTab === 'aiSuggestions' ? '🤖' :
               searchTerm ? '🔍' : '🎬'}
            </div>
            <h3 className="text-white text-3xl font-bold mb-4">
              {activeTab === 'myLists' 
                ? "Your collection is empty"
                : activeTab === 'aiSuggestions'
                ? "Ready for AI magic?"
                : searchTerm 
                ? "No results found" 
                : "No movies to display"
              }
            </h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              {activeTab === 'myLists' 
                ? "Start adding movies to your favorites and watchlist to see them here."
                : activeTab === 'aiSuggestions'
                ? "Describe what you're in the mood for and let AI find the perfect movies."
                : searchTerm 
                ? 'Try adjusting your search terms or browse by category.' 
                : 'Try switching tabs or adjusting your filters.'
              }
            </p>
          </div>
        )}
      </div>
      
      {/* Details Modal */}
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