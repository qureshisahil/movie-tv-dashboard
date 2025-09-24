import React, { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, loading }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const popularSearches = [
    'Marvel', 'DC Comics', 'Disney', 'Horror', 'Comedy', 'Action', 
    'Sci-Fi', 'Romance', 'Thriller', 'Documentary'
  ];

  const handleClearSearch = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handlePopularSearch = (term) => {
    setSearchTerm(term);
    setIsFocused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setIsFocused(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main Search Container */}
      <div className={`glass-morphism rounded-2xl border transition-all duration-300 ${
        isFocused 
          ? 'border-purple-500/50 shadow-2xl shadow-purple-500/10' 
          : 'border-white/10 hover:border-white/20'
      }`}>
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
            <Search className={`w-5 h-5 transition-colors ${
              isFocused ? 'text-purple-400' : 'text-gray-400'
            }`} />
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search movies, TV shows, actors, directors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="w-full pl-14 pr-24 py-5 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg font-medium"
            style={{ fontFamily: 'var(--font-primary)' }}
          />

          {/* Right Side Controls */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
            {/* Loading Spinner */}
            {loading && (
              <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            )}
            
            {/* Clear Button */}
            {searchTerm && !loading && (
              <button
                onClick={handleClearSearch}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Keyboard Shortcut */}
            {!isFocused && !searchTerm && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white/5 rounded-md border border-white/10">
                <span className="text-xs text-gray-500">Ctrl</span>
                <span className="text-xs text-gray-400">+</span>
                <span className="text-xs text-gray-500">K</span>
              </div>
            )}
          </div>
        </div>

        {/* Popular Searches Dropdown */}
        {isFocused && !searchTerm && (
          <div className="border-t border-white/10 p-4 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-gray-300">Popular Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handlePopularSearch(term)}
                  className="px-3 py-1.5 text-sm bg-white/5 hover:bg-purple-500/20 text-gray-300 hover:text-white rounded-lg border border-white/10 hover:border-purple-500/30 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Count */}
        {searchTerm && !loading && (
          <div className="border-t border-white/10 px-6 py-3">
            <span className="text-sm text-gray-400">
              Searching for "<span className="text-purple-300 font-medium">{searchTerm}</span>"
            </span>
          </div>
        )}
      </div>

      {/* Search Tips */}
      {isFocused && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            💡 Try searching for movies, actors, directors, or describe what you're looking for
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;