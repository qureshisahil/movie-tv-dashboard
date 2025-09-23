import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import './App.css';

import { tmdbApi } from './services/tmdbApi';
import { genreMap } from './utils/helpers';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import ErrorDisplay from './components/ErrorDisplay';
import DetailsModal from './components/DetailsModal';
import AdvancedFilters from './components/AdvancedFilters';

function App() {
  const [activeTab, setActiveTab] = useState('discover'); // Default to discover
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [movieData, setMovieData] = useState({ discover: [], trending: [], topRated: [], search: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // States for the modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  
  // States for advanced filters
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('popularity.desc');

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [trendingRes, topRatedMoviesRes] = await Promise.all([
        tmdbApi.getTrending(),
        tmdbApi.getTopRatedMovies(),
      ]);

      setMovieData(prev => ({
        ...prev,
        trending: trendingRes.results || [],
        topRated: topRatedMoviesRes.results || [],
      }));
    } catch (err) {
      setError('Failed to load data. Please check your API key.');
      console.error('Error loading initial data:', err);
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
      console.error('Error loading discover data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Effect for initial load and tab switching
  useEffect(() => {
    // Load static lists once on mount
    loadInitialData();
  }, []);

  // Effect for dynamic filtering on the discover tab
  useEffect(() => {
    if (activeTab === 'discover') {
      loadDiscoverData();
    }
  }, [activeTab, selectedGenre, sortBy]);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchMovies(searchTerm);
      } else if (activeTab !== 'discover') {
        // Clear search results if search term is cleared and not on discover tab
        setMovieData(prev => ({ ...prev, search: [] }));
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
    if (searchTerm && movieData.search.length > 0) {
      return movieData.search;
    }
    return movieData[activeTab] || [];
  };

  const handleCardClick = async (item) => {
    setSelectedItem(item);
    setDetailsLoading(true);
    try {
      const mediaType = item.media_type === 'movie' ? 'movie' : 'tv';
      const detailsData = mediaType === 'movie'
        ? await tmdbApi.getMovieDetails(item.id)
        : await tmdbApi.getTVDetails(item.id);
      setDetails(detailsData);
    } catch (err) {
      console.error("Failed to fetch details", err);
      setError("Could not fetch details for this item.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
    setDetails(null);
  };

  if (error && !selectedItem) {
    return <ErrorDisplay error={error} onRetry={activeTab === 'discover' ? loadDiscoverData : loadInitialData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-gray-200">
      <div className="p-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Play className="text-purple-400" />
            CineTracker
          </h1>
          <p className="text-gray-400">
            Discover your next favorite movie or TV show.
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex bg-white/5 backdrop-blur-xl rounded-lg p-1 border border-white/10">
              {['discover', 'trending', 'topRated'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSearchTerm('');
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${
                    activeTab === tab && !searchTerm
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab === 'topRated' ? 'Top Rated' : tab}
                </button>
              ))}
            </div>

            <SearchBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              loading={loading}
            />
          </div>

          {activeTab === 'discover' && !searchTerm && (
            <AdvancedFilters
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              sortBy={sortBy}
              setSortBy={setSortBy}
              genres={Object.entries(genreMap).map(([id, name]) => ({ id, name }))}
            />
          )}

          {loading && getFilteredData().length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-purple-200">Loading...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredData().map((item) => (
                <MovieCard
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

          {!loading && getFilteredData().length === 0 && (
            <div className="text-center py-12">
              <div className="text-indigo-400 text-6xl mb-4">🎬</div>
              <h3 className="text-white text-xl font-semibold mb-2">No results found</h3>
              <p className="text-gray-400">
                {searchTerm ? 'Try a different search term.' : 'Try adjusting your filters or switching tabs.'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {selectedItem && (
        <DetailsModal
          item={selectedItem}
          details={details}
          loading={detailsLoading}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}

export default App;