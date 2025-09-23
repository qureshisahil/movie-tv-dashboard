import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, loading }) => {
  return (
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
      <input
        type="text"
        placeholder="Search movies and TV shows..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;