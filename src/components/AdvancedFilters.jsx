import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, Globe, Calendar, Star, Clock } from 'lucide-react';
import { genreMap, popularLanguages, popularRegions, usCertifications } from '../utils/helpers';

const sortOptions = [
  { value: 'popularity.desc', label: 'Most Popular', icon: '🔥' },
  { value: 'vote_average.desc', label: 'Highest Rated', icon: '⭐' },
  { value: 'release_date.desc', label: 'Newest First', icon: '📅' },
  { value: 'release_date.asc', label: 'Oldest First', icon: '🕰️' },
  { value: 'revenue.desc', label: 'Highest Grossing', icon: '💰' },
  { value: 'vote_count.desc', label: 'Most Voted', icon: '👥' }
];

const AdvancedFilters = ({ 
  selectedGenre, 
  setSelectedGenre, 
  sortBy, 
  setSortBy,
  filters = {},
  onFilterChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const genreOptions = Object.entries(genreMap).map(([id, name]) => ({ id, name }));
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const updateFilter = (key, value) => {
    if (onFilterChange) {
      onFilterChange({ ...filters, [key]: value });
    }
  };

  return (
    <div className="glass-morphism rounded-2xl border border-white/10 mb-6 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-primary">Advanced Filters</h3>
              <p className="text-gray-400 text-sm">Fine-tune your movie discovery experience</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-all border border-white/10"
          >
            {isExpanded ? 'Less Filters' : 'More Filters'}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Basic Filters - Always Visible */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Genre Filter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              🎭 Genre
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none form-control"
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
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              📊 Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none form-control"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <Star className="w-4 h-4" /> Min Rating
            </label>
            <select
              value={filters.minRating || ''}
              onChange={(e) => updateFilter('minRating', e.target.value || null)}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none form-control"
            >
              <option value="" className="bg-gray-800">Any Rating</option>
              <option value="7" className="bg-gray-800">7+ Stars</option>
              <option value="8" className="bg-gray-800">8+ Stars</option>
              <option value="9" className="bg-gray-800">9+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Filters - Expandable */}
      {isExpanded && (
        <div className="border-t border-white/10 p-6 space-y-6 animate-fade-in-up">
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            🔧 Advanced Options
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Language Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <Globe className="w-4 h-4" /> Language
              </label>
              <select
                value={filters.originalLanguage || 'all'}
                onChange={(e) => updateFilter('originalLanguage', e.target.value === 'all' ? null : e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none form-control"
              >
                <option value="all" className="bg-gray-800">All Languages</option>
                {popularLanguages.map(lang => (
                  <option key={lang.iso_639_1} value={lang.iso_639_1} className="bg-gray-800">
                    {lang.english_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                🌍 Region
              </label>
              <select
                value={filters.region || 'all'}
                onChange={(e) => updateFilter('region', e.target.value === 'all' ? null : e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none form-control"
              >
                <option value="all" className="bg-gray-800">All Regions</option>
                {popularRegions.map(region => (
                  <option key={region.iso_3166_1} value={region.iso_3166_1} className="bg-gray-800">
                    {region.english_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Release Year */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <Calendar className="w-4 h-4" /> Release Year
              </label>
              <select
                value={filters.releaseYear || ''}
                onChange={(e) => updateFilter('releaseYear', e.target.value || null)}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none form-control"
              >
                <option value="" className="bg-gray-800">Any Year</option>
                {years.map(year => (
                  <option key={year} value={year} className="bg-gray-800">
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Certification */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                🔞 Rating (MPAA)
              </label>
              <select
                value={filters.certification || 'all'}
                onChange={(e) => updateFilter('certification', e.target.value === 'all' ? null : e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none form-control"
              >
                <option value="all" className="bg-gray-800">Any Rating</option>
                {usCertifications.map(cert => (
                  <option key={cert.certification} value={cert.certification} className="bg-gray-800">
                    {cert.certification} - {cert.meaning}
                  </option>
                ))}
              </select>
            </div>

            {/* Runtime Range */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <Clock className="w-4 h-4" /> Min Runtime
              </label>
              <select
                value={filters.minRuntime || ''}
                onChange={(e) => updateFilter('minRuntime', e.target.value || null)}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none form-control"
              >
                <option value="" className="bg-gray-800">Any Length</option>
                <option value="60" className="bg-gray-800">1+ Hours</option>
                <option value="90" className="bg-gray-800">1.5+ Hours</option>
                <option value="120" className="bg-gray-800">2+ Hours</option>
                <option value="150" className="bg-gray-800">2.5+ Hours</option>
              </select>
            </div>

            {/* Min Votes */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                👥 Min Votes
              </label>
              <select
                value={filters.minVotes || ''}
                onChange={(e) => updateFilter('minVotes', e.target.value || null)}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none form-control"
              >
                <option value="" className="bg-gray-800">Any Amount</option>
                <option value="100" className="bg-gray-800">100+ Votes</option>
                <option value="500" className="bg-gray-800">500+ Votes</option>
                <option value="1000" className="bg-gray-800">1000+ Votes</option>
                <option value="5000" className="bg-gray-800">5000+ Votes</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                setSelectedGenre('all');
                setSortBy('popularity.desc');
                if (onFilterChange) {
                  onFilterChange({});
                }
              }}
              className="px-6 py-2 bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-red-300 rounded-lg transition-all border border-white/10 hover:border-red-500/30"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;