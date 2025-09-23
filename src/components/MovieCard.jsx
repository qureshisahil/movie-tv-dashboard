import React from 'react';
import { Star, Calendar, Users, Heart, Bookmark } from 'lucide-react';
import { 
  getTitle, 
  getReleaseDate, 
  getMediaType, 
  getPosterUrl, 
  getGenreNames, 
  getRatingColor, 
  getRatingBg 
} from '../utils/helpers';
import { IMAGE_BASE_URL } from '../services/tmdbApi';

const MovieCard = ({ item, favorites, watchlist, toggleFavorite, toggleWatchlist, onCardClick }) => { // Add onCardClick prop
  const handleActionClick = (e, action) => {
    e.stopPropagation(); // Prevent modal from opening when clicking favorite/watchlist
    action(item.id);
  };

  return (
    <div className="group relative" onClick={() => onCardClick(item)}> {/* Add onClick here */}
      <div className="bg-white/10 backdrop-blur rounded-xl overflow-hidden border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 cursor-pointer">
        {/* Poster */}
        <div className="relative overflow-hidden">
          <img
            src={getPosterUrl(item, IMAGE_BASE_URL)}
            alt={getTitle(item)}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.src = `https://picsum.photos/300/450?random=${item.id}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium ${
            getMediaType(item) === 'movie' ? 'bg-blue-500' : 'bg-green-500'
          }`}>
            {getMediaType(item) === 'movie' ? 'Movie' : 'TV Show'}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => handleActionClick(e, toggleFavorite)}
              className={`p-2 rounded-full backdrop-blur transition-colors ${
                favorites.includes(item.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white/20 text-white hover:bg-red-500'
              }`}
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleActionClick(e, toggleWatchlist)}
              className={`p-2 rounded-full backdrop-blur transition-colors ${
                watchlist.includes(item.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/20 text-white hover:bg-blue-500'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">
            {getTitle(item)}
          </h3>
          
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border mb-3 ${getRatingBg(item.vote_average)}`}>
            <Star className={`w-4 h-4 ${getRatingColor(item.vote_average)}`} />
            <span className={`text-sm font-medium ${getRatingColor(item.vote_average)}`}>
              {item.vote_average?.toFixed(1) || 'N/A'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {getGenreNames(item).map((genre, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-md border border-purple-500/30"
              >
                {genre}
              </span>
            ))}
          </div>
          
          {/* ... (rest of the card is the same) ... */}
          {getReleaseDate(item) && (
            <div className="flex items-center gap-1 text-purple-200 text-sm mb-2">
              <Calendar className="w-4 h-4" />
              {new Date(getReleaseDate(item)).getFullYear()}
            </div>
          )}

          <p className="text-purple-100 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {item.overview || 'No overview available.'}
          </p>
          
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-200">Popularity</span>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-purple-100 font-medium">
                  {Math.round(item.popularity || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;