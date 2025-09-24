import React, { useState, useEffect } from 'react';
import { X, Star, Calendar, Tv, Film } from 'lucide-react';
import { tmdbApi, IMAGE_BASE_URL, BACKDROP_BASE_URL } from '../services/tmdbApi';
import { getTitle, getReleaseDate, getPosterUrl, getRatingColor } from '../utils/helpers';

// A small component for the recommendation items
const SimilarItemCard = ({ item, onSimilarClick }) => (
  <div 
    className="flex-shrink-0 w-32 cursor-pointer group"
    onClick={() => onSimilarClick(item)}
  >
    <img
      src={getPosterUrl(item, IMAGE_BASE_URL)}
      alt={getTitle(item)}
      className="rounded-md group-hover:opacity-80 transition-opacity"
    />
    <p className="text-white text-xs mt-2 line-clamp-2">{getTitle(item)}</p>
  </div>
);

const DetailsModal = ({ item, details, loading, onClose, onCardClick }) => {
  const [recommendations, setRecommendations] = useState({ collection: [], similar: [] });
  const [recLoading, setRecLoading] = useState(false);
  const [activeRecTab, setActiveRecTab] = useState('similar');

  useEffect(() => {
    if (details) {
      const fetchRecommendations = async () => {
        setRecLoading(true);
        try {
          let collectionPromise = Promise.resolve(null);
          let similarPromise;
          
          const isMovie = !details.seasons;

          if (isMovie) {
            if (details.belongs_to_collection) {
              collectionPromise = tmdbApi.getCollectionDetails(details.belongs_to_collection.id);
            }
            similarPromise = tmdbApi.getSimilarMovies(details.id);
          } else {
            similarPromise = tmdbApi.getSimilarTV(details.id);
          }
          
          const [collectionData, similarData] = await Promise.all([collectionPromise, similarPromise]);
          
          if (collectionData && collectionData.parts) {
            setActiveRecTab('collection');
            setRecommendations({
              collection: collectionData.parts.filter(p => p.id !== details.id),
              similar: similarData.results || []
            });
          } else {
            setActiveRecTab('similar');
            setRecommendations({
              collection: [],
              similar: similarData.results || []
            });
          }

        } catch (error) {
          console.error('Failed to fetch recommendations:', error);
        } finally {
          setRecLoading(false);
        }
      };
      fetchRecommendations();
    }
  }, [details]);

  const handleSimilarClick = (newItem) => {
    onClose();
    setTimeout(() => onCardClick(newItem), 300);
  };
  
  if (!item) return null;

  const title = details ? getTitle(details) : '';
  const releaseYear = details && getReleaseDate(details) ? new Date(getReleaseDate(details)).getFullYear() : '';
  const backdropPath = details?.backdrop_path || item?.backdrop_path;
  const backdropUrl = backdropPath ? `${BACKDROP_BASE_URL}${backdropPath}` : null;
  const posterUrl = details ? getPosterUrl(details, IMAGE_BASE_URL) : getPosterUrl(item, IMAGE_BASE_URL);

  const recTabs = [
    { key: 'collection', label: 'In This Series', data: recommendations.collection },
    { key: 'similar', label: 'You Might Also Like', data: recommendations.similar },
  ].filter(tab => tab.data && tab.data.length > 0);

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="glass-effect rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative flex flex-col shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage: backdropUrl ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${backdropUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white bg-white/20 rounded-full p-2 hover:bg-white/40 transition-colors z-20"
        >
          <X size={24} />
        </button>

        {loading || !details ? (
          <div className="flex-1 flex items-center justify-center p-8 min-h-[300px]">
            <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            <div className="w-full md:w-1/3 flex-shrink-0 p-4 flex items-center justify-center">
              <img
                src={posterUrl}
                alt={title}
                className="w-full h-auto max-h-[calc(90vh-80px)] object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-black/30 md:bg-transparent">
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

              {details.credits?.cast.length > 0 && (
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
              
              {details.seasons && (
                <div className="mt-8">
                  <h3 className="text-white text-lg font-semibold mb-2">Seasons</h3>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 max-h-40 overflow-y-auto custom-scrollbar">
                    {details.seasons.map(season => (
                      season.air_date && <div key={season.id} className="flex justify-between items-center text-sm text-gray-300 py-1">
                        <span>{season.name} ({new Date(season.air_date).getFullYear()})</span>
                        <span className="text-gray-400">{season.episode_count} Episodes</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!recLoading && recTabs.length > 0 && (
                <div className="mt-8">
                  <div className="flex border-b border-white/10 mb-4">
                    {recTabs.map(tab => (
                      <button 
                        key={tab.key}
                        onClick={() => setActiveRecTab(tab.key)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          activeRecTab === tab.key 
                            ? 'text-white border-b-2 border-purple-500' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                    {recommendations[activeRecTab]?.map(similarItem => (
                      <SimilarItemCard 
                        key={similarItem.id} 
                        item={similarItem} 
                        onSimilarClick={handleSimilarClick} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsModal;