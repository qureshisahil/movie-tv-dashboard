import React from 'react';
import { Filter } from 'lucide-react';

const GenreFilter = ({ selectedGenre, setSelectedGenre, genres }) => {
  return (
    <div className="relative">
      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
      <select
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
        className="pl-10 pr-8 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
      >
        {genres.map(genre => (
          <option key={genre} value={genre} className="bg-gray-800">
            {genre === 'all' ? 'All Genres' : genre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GenreFilter;