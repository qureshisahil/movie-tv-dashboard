import React from 'react';
import { genreMap } from '../utils/helpers';

const sortOptions = [
  { value: 'popularity.desc', label: 'Popularity' },
  { value: 'vote_average.desc', label: 'Rating' },
  { value: 'release_date.desc', label: 'Newest' },
];

const AdvancedFilters = ({ selectedGenre, setSelectedGenre, sortBy, setSortBy }) => {
  const genreOptions = Object.entries(genreMap).map(([id, name]) => ({ id, name }));

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 rounded-xl glass-effect border border-white/10">
      {/* Genre Filter */}
      <div className="flex-1 relative">
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
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6">
          <svg className="fill-current h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
        </div>
      </div>

      {/* Sort By Filter */}
      <div className="flex-1 relative">
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
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6">
          <svg className="fill-current h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;