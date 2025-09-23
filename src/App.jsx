import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Play, Heart, Bookmark } from 'lucide-react';
import './App.css';

import { tmdbApi } from './services/tmdbApi';
import { genreMap, calculateAverageRating } from './utils/helpers';
import StatsCard from './components/StatsCard';
import SearchBar from './components/SearchBar';
import GenreFilter from './components/GenreFilter';
import MovieCard from './components/MovieCard';
import ErrorDisplay from './components/ErrorDisplay';
import DetailsModal from './components/DetailsModal';

function App() {
  const [activeTab, setActiveTab] = useState('trending');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [movieData, setMovieData] = useState({ trending: [], topRated: [], search: [] });
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // New states for the modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [trendingRes, topRatedMoviesRes, topRatedTVRes] = await Promise.all([
        tmdbApi.getTrending(),
        tmdbApi.getTopRatedMovies(),
        tmdbApi.getTopRatedTV()
      ]);

      const topRatedCombined = [
        ...topRatedMoviesRes.results.slice(0, 10).map(item => ({ ...item, media_type: 'movie' })),
        ...topRatedTVRes.results.slice(0, 10).map(item => ({ ...item, media_type: 'tv' }))
      ].sort((a, b) => b.vote_average - a.vote_average);

      setMovieData({
        trending: trendingRes.results || [],
        topRated: topRatedCombined,
        search: []
      });

      const allItems = [...trendingRes.results, ...topRatedCombined];
      const uniqueGenres = [...new Set(allItems.flatMap(item => item.genre_ids || []))]
        .map(id => genreMap[id])
        .filter(Boolean)
        .sort();
      
      setGenres(['all', ...uniqueGenres]);
    } catch (err) {
      setError('Failed to load data. Please check your API key.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

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
      } else {
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
    let data = [];
    
    if (searchTerm && movieData.search.length > 0) {
      data = movieData.search;
    } else {
      data = movieData[activeTab] || [];
    }
    
    if (selectedGenre !== 'all') {
      const genreId = Object.keys(genreMap).find(key => genreMap[key] === selectedGenre);
      data = data.filter(item => item.genre_ids?.includes(parseInt(genreId)));
    }
    
    return data;
  };

  // Functions to handle modal
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
    return <ErrorDisplay error={error} onRetry={loadInitialData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Play className="text-purple-400" />
            CineTracker
          </h1>
          <p className="text-gray-400">
            Real-time movie and TV show data from The Movie Database
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title={searchTerm ? 'Search Results' : activeTab === 'trending' ? 'Trending Now' : 'Top Rated'}
              value={getFilteredData().length}
              icon={TrendingUp}
            />
            
            <StatsCard
              title="Avg Rating"
              value={calculateAverageRating(getFilteredData())}
              icon={Star}
            />
            
            <StatsCard
              title="Favorites"
              value={favorites.length}
              icon={Heart}
            />
            
            <StatsCard
              title="Watchlist"
              value={watchlist.length}
              icon={Bookmark}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex bg-white/5 backdrop-blur-xl rounded-lg p-1 border border-white/10">
              {['trending', 'topRated'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSearchTerm('');
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab && !searchTerm
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab === 'trending' ? 'Trending' : 'Top Rated'}
                </button>
              ))}
            </div>

            <SearchBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              loading={loading}
            />

            <GenreFilter 
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              genres={genres}
            />
          </div>

          {/* Content Grid */}
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

          {/* No Results */}
          {!loading && getFilteredData().length === 0 && (
            <div className="text-center py-12">
              <div className="text-indigo-400 text-6xl mb-4">🎬</div>
              <h3 className="text-white text-xl font-semibold mb-2">No results found</h3>
              <p className="text-gray-400">
                {searchTerm ? 'Try a different search term' : 'Try adjusting your filter criteria'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Render the modal */}
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