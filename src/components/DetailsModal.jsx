import React from 'react';
import { X, Star, Calendar, Tv, Film } from 'lucide-react';
import { IMAGE_BASE_URL, BACKDROP_BASE_URL } from '../services/tmdbApi';
import { getTitle, getReleaseDate, getPosterUrl, getRatingColor } from '../utils/helpers';

const DetailsModal = ({ item, details, loading, onClose }) => {
  if (!item) return null;

  const title = details ? getTitle(details) : '';
  const releaseYear = details && getReleaseDate(details) ? new Date(getReleaseDate(details)).getFullYear() : '';
  const backdropPath = details?.backdrop_path || item?.backdrop_path; // Use item's backdrop as fallback
  const backdropUrl = backdropPath ? `${BACKDROP_BASE_URL}${backdropPath}` : null;
  const posterUrl = details ? getPosterUrl(details, IMAGE_BASE_URL) : getPosterUrl(item, IMAGE_BASE_URL);

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" // Smoother background fade
      onClick={onClose}
    >
      <div 
        className="glass-effect rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative flex flex-col shadow-2xl animate-scale-in" // Apply glass effect and scale-in animation
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage: backdropUrl ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${backdropUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white bg-white/20 rounded-full p-2 hover:bg-white/40 transition-colors z-10" // More glass-like close button
        >
          <X size={24} />
        </button>

        {loading || !details ? (
          <div className="flex-1 flex items-center justify-center p-8 min-h-[300px]">
            <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Left Side: Poster (now responsive and fits better) */}
            <div className="w-full md:w-1/3 flex-shrink-0 p-4 flex items-center justify-center">
              <img
                src={posterUrl}
                alt={title}
                className="w-full h-auto max-h-[calc(90vh-80px)] object-contain rounded-lg shadow-lg" // Object-contain for better fitting
              />
            </div>

            {/* Right Side: Details */}
            <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-black/30 md:bg-transparent"> {/* Semi-transparent background for readability */}
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h2>
              
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-gray-400 text-sm mb-4">
                {releaseYear && <span><Calendar className="inline w-4 h-4 mr-1" />{releaseYear}</span>}
                {details.runtime && <span><Film className="inline w-4 h-4 mr-1" />{details.runtime} min</span>}
                {details.number_of_seasons && <span><Tv className="inline w-4 h-4 mr-1" />{details.number_of_seasons} Seasons</span>}
                {details.episode_run_time && details.episode_run_time.length > 0 && (
                  <span><Film className="inline w-4 h-4 mr-1" />{details.episode_run_time[0]} min/episode</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {details.genres?.map(genre => (
                  <span key={genre.id} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full border border-indigo-500/30">
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Star className={`w-6 h-6 ${getRatingColor(details.vote_average)}`} />
                <span className={`text-2xl font-bold ${getRatingColor(details.vote_average)}`}>
                  {details.vote_average?.toFixed(1) || 'N/A'}
                </span>
                <span className="text-gray-400">/ 10</span>
              </div>
              
              <h3 className="text-white text-lg font-semibold mb-2">Plot</h3>
              <p className="text-gray-300 text-sm mb-6">{details.overview || 'No overview available.'}</p>

              {details.credits?.cast.length > 0 && ( // Only show cast if available
                <>
                  <h3 className="text-white text-lg font-semibold mb-4">Top Cast</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {details.credits.cast.slice(0, 8).map(actor => (
                      <div key={actor.cast_id} className="text-center">
                        <img
                          src={actor.profile_path ? `${IMAGE_BASE_URL}${actor.profile_path}` : 'https://via.placeholder.com/150'}
                          alt={actor.name}
                          className="w-20 h-20 rounded-full object-cover mx-auto mb-2 border border-indigo-500/30 hover:scale-105 transition-transform"
                        />
                        <p className="text-white text-sm font-medium line-clamp-1">{actor.name}</p>
                        <p className="text-gray-400 text-xs line-clamp-1">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsModal;