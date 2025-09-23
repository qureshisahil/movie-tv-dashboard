import React from 'react';
import { SortAsc, SortDesc, Calendar, Star } from 'lucide-react';
import { genreMap } from '../utils/helpers';

const sortOptions = [
  { value: 'popularity.desc', label: 'Popularity', icon: SortDesc },
  { value: 'vote_average.desc', label: 'Rating', icon: SortDesc },
  { value: 'release_date.desc', label: 'Newest', icon: Calendar },
];

const AdvancedFilters = ({ selectedGenre, setSelectedGenre, sortBy, setSortBy, genres }) => {
  // We need the full genre list with IDs for the discover API
  const genreOptions = Object.entries(genreMap).map(([id, name]) => ({ id, name }));

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 rounded-xl glass-effect border border-white/10">
      {/* Genre Filter */}
      <div className="flex-1">
        <label htmlFor="genre-filter" className="text-sm font-medium text-gray-400 block mb-2">Genre</label>
        <select
          id="genre-filter"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="w-full pl-4 pr-10 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
        >
          <option value="all" className="bg-gray-800">All Genres</option>
          {genreOptions.map(genre => (
            <option key={genre.id} value={genre.id} className="bg-gray-800">
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By Filter */}
      <div className="flex-1">
        <label htmlFor="sort-by" className="text-sm font-medium text-gray-400 block mb-2">Sort By</label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full pl-4 pr-10 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value} className="bg-gray-800">
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AdvancedFilters;