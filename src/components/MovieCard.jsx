import React from 'react';
import { Star, Calendar, Users, Heart, Bookmark, Play, Info } from 'lucide-react';
import { 
  getTitle, 
  getReleaseDate, 
  getMediaType, 
  getPosterUrl, 
  getGenreNames, 
  getRatingColor, 
  getRatingBg,
  formatPopularity,
  getGradientForRating
} from '../utils/helpers';
import { IMAGE_BASE_URL } from '../services/tmdbApi';

const MovieCard = ({ item, favorites, watchlist, toggleFavorite, toggleWatchlist, onCardClick }) => {
  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action(item.id);
  };

  const mediaType = getMediaType(item);
  const title = getTitle(item);
  const releaseDate = getReleaseDate(item);
  const genres = getGenreNames(item);
  const rating = item.vote_average || 0;

  return (
    <div className="group relative card-hover interactive" onClick={() => onCardClick(item)}>
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-purple-400/30 transition-all duration-500">
        {/* Poster Section */}
        <div className="relative overflow-hidden aspect-[2/3]">
          <img
            src={getPosterUrl(item, IMAGE_BASE_URL)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/500x750/1f2937/9ca3af?text=${encodeURIComponent(title)}`;
            }}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Media Type Badge */}
          <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border ${
            mediaType === 'movie' 
              ? 'bg-blue-500/90 text-white border-blue-400/50' 
              : 'bg-green-500/90 text-white border-green-400/50'
          }`}>
            {mediaType === 'movie' ? '🎬 Movie' : '📺 TV Show'}
          </div>

          {/* Rating Badge */}
          {rating > 0 && (
            <div className={`absolute top-4 right-4 px-2 py-1 rounded-lg backdrop-blur-md border text-xs font-bold ${getRatingBg(rating)}`}>
              <div className="flex items-center gap-1">
                <Star className={`w-3 h-3 ${getRatingColor(rating)}`} />
                <span className={getRatingColor(rating)}>
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={(e) => handleActionClick(e, toggleFavorite)}
              className={`p-3 rounded-full backdrop-blur-md transition-all transform hover:scale-110 ${
                favorites.includes(item.id)
                  ? 'bg-red-500/90 text-white border border-red-400/50'
                  : 'bg-white/20 text-white hover:bg-red-500/90 border border-white/30 hover:border-red-400/50'
              }`}
            >
              <Heart className="w-4 h-4" fill={favorites.includes(item.id) ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={(e) => handleActionClick(e, toggleWatchlist)}
              className={`p-3 rounded-full backdrop-blur-md transition-all transform hover:scale-110 ${
                watchlist.includes(item.id)
                  ? 'bg-blue-500/90 text-white border border-blue-400/50'
                  : 'bg-white/20 text-white hover:bg-blue-500/90 border border-white/30 hover:border-blue-400/50'
              }`}
            >
              <Bookmark className="w-4 h-4" fill={watchlist.includes(item.id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="p-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Info className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors">
            {title}
          </h3>
          
          {/* Rating Bar */}
          {rating > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Rating</span>
                <span className={`font-bold ${getRatingColor(rating)}`}>
                  {rating.toFixed(1)}/10
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 bg-gradient-to-r ${getGradientForRating(rating)} transition-all duration-1000 ease-out`}
                  style={{ width: `${(rating / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Genres */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.map((genre, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xs font-medium rounded-full border border-purple-500/30 hover:border-purple-400/50 transition-colors"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
          
          {/* Release Date & Popularity */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            {releaseDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(releaseDate).getFullYear()}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span className="font-medium">{formatPopularity(item.popularity)}</span>
            </div>
          </div>

          {/* Overview Preview */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
              {item.overview || 'No description available.'}
            </p>
          </div>

          {/* Interactive Footer */}
          <div className="pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {favorites.includes(item.id) && (
                  <span className="text-xs text-red-400 font-medium">❤️ Favorite</span>
                )}
                {watchlist.includes(item.id) && (
                  <span className="text-xs text-blue-400 font-medium">🔖 Watchlist</span>
                )}
              </div>
              <span className="text-xs text-gray-500 hover:text-purple-400 transition-colors cursor-pointer">
                Click for details →
              </span>
            </div>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;