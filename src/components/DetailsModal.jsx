import React from 'react';
import { X, Star, Calendar, Tv, Film } from 'lucide-react';
import { IMAGE_BASE_URL, BACKDROP_BASE_URL } from '../services/tmdbApi';
import { getTitle, getReleaseDate, getPosterUrl, getRatingColor } from '../utils/helpers';

const DetailsModal = ({ item, details, loading, onClose }) => {
  if (!item) return null;

  const title = getTitle(details);
  const releaseYear = details ? new Date(getReleaseDate(details)).getFullYear() : '';
  const backdropUrl = details?.backdrop_path ? `${BACKDROP_BASE_URL}${details.backdrop_path}` : '';
  
  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {loading ? (
          <div className="w-full flex items-center justify-center p-8">
            <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : details && (
          <>
            {/* Left Side: Poster */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <img
                src={getPosterUrl(details, IMAGE_BASE_URL)}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Side: Details */}
            <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto custom-scrollbar">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h2>
              
              <div className="flex items-center gap-4 text-purple-200 text-sm mb-4">
                <span>{releaseYear}</span>
                {details.runtime && <span><Film className="inline w-4 h-4 mr-1" />{details.runtime} min</span>}
                {details.number_of_seasons && <span><Tv className="inline w-4 h-4 mr-1" />{details.number_of_seasons} Seasons</span>}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {details.genres?.map(genre => (
                  <span key={genre.id} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Star className={`w-6 h-6 ${getRatingColor(details.vote_average)}`} />
                <span className={`text-2xl font-bold ${getRatingColor(details.vote_average)}`}>
                  {details.vote_average?.toFixed(1)}
                </span>
                <span className="text-purple-300">/ 10</span>
              </div>
              
              <h3 className="text-white text-lg font-semibold mb-2">Plot</h3>
              <p className="text-purple-100 text-sm mb-6">{details.overview}</p>

              <h3 className="text-white text-lg font-semibold mb-4">Cast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {details.credits?.cast.slice(0, 8).map(actor => (
                  <div key={actor.cast_id} className="text-center">
                    <img
                      src={actor.profile_path ? `${IMAGE_BASE_URL}${actor.profile_path}` : 'https://via.placeholder.com/150'}
                      alt={actor.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-2 border-2 border-purple-500/30"
                    />
                    <p className="text-white text-sm font-medium">{actor.name}</p>
                    <p className="text-purple-300 text-xs">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>
    </div>
  );
};

export default DetailsModal;