import React, { useState, useEffect } from 'react';
import { X, Star, Calendar, Tv, Film, Clock, Users, Globe, Award, Play } from 'lucide-react';
import { tmdbApi, IMAGE_BASE_URL, BACKDROP_BASE_URL } from '../services/tmdbApi';
import { 
  getTitle, 
  getReleaseDate, 
  getPosterUrl, 
  getRatingColor, 
  getGradientForRating,
  formatRuntime,
  formatReleaseDate,
  formatPopularity
} from '../utils/helpers';

const SimilarItemCard = ({ item, onSimilarClick }) => (
  <div 
    className="flex-shrink-0 w-36 cursor-pointer group"
    onClick={() => onSimilarClick(item)}
  >
    <div className="relative overflow-hidden rounded-lg">
      <img
        src={getPosterUrl(item, IMAGE_BASE_URL)}
        alt={getTitle(item)}
        className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <Play className="w-8 h-8 text-white" />
      </div>
    </div>
    <div className="mt-2">
      <p className="text-white text-sm font-medium line-clamp-2">{getTitle(item)}</p>
      <div className="flex items-center gap-1 mt-1">
        <Star className="w-3 h-3 text-yellow-400" />
        <span className="text-xs text-gray-400">{(item.vote_average || 0).toFixed(1)}</span>
      </div>
    </div>
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

  const title = details ? getTitle(details) : getTitle(item);
  const releaseYear = details && getReleaseDate(details) ? new Date(getReleaseDate(details)).getFullYear() : '';
  const backdropPath = details?.backdrop_path || item?.backdrop_path;
  const backdropUrl = backdropPath ? `${BACKDROP_BASE_URL}${backdropPath}` : null;
  const posterUrl = details ? getPosterUrl(details, IMAGE_BASE_URL) : getPosterUrl(item, IMAGE_BASE_URL);
  const rating = details?.vote_average || item?.vote_average || 0;

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
        className="rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative flex flex-col shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage: backdropUrl ? `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${backdropUrl})` : 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white bg-white/20 backdrop-blur-md rounded-full p-2 hover:bg-white/40 transition-colors z-20"
        >
          <X size={24} />
        </button>

        {loading || !details ? (
          <div className="flex-1 flex items-center justify-center p-8 min-h-[300px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300">Loading movie details...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Left side - Poster */}
            <div className="w-full md:w-1/3 flex-shrink-0 p-6 flex items-center justify-center">
              <img
                src={posterUrl}
                alt={title}
                className="w-full h-auto max-h-[calc(90vh-80px)] object-contain rounded-lg shadow-2xl border border-white/20"
              />
            </div>

            {/* Right side - Content */}
            <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 text-shadow">{title}</h2>
                
                <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-gray-300 text-sm mb-4">
                  {releaseYear && (
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {releaseYear}
                    </span>
                  )}
                  {details.runtime && (
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatRuntime(details.runtime)}
                    </span>
                  )}
                  {details.number_of_seasons && (
                    <span className="flex items-center gap-2">
                      <Tv className="w-4 h-4" />
                      {details.number_of_seasons} Seasons
                    </span>
                  )}
                  {details.episode_run_time && details.episode_run_time.length > 0 && (
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {details.episode_run_time[0]} min/episode
                    </span>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {details.genres?.map(genre => (
                    <span 
                      key={genre.id} 
                      className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-full border border-white/30"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className={`w-6 h-6 ${getRatingColor(rating)}`} />
                    <span className={`text-2xl font-bold ${getRatingColor(rating)}`}>
                      {rating.toFixed(1)}
                    </span>
                    <span className="text-gray-400">/ 10</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-semibold">
                      {formatPopularity(details.popularity)} popularity
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Overview */}
              <div className="mb-8">
                <h3 className="text-white text-xl font-semibold mb-3">Synopsis</h3>
                <p className="text-gray-200 leading-relaxed">
                  {details.overview || 'No synopsis available.'}
                </p>
              </div>

              {/* Cast */}
              {details.credits?.cast?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-white text-xl font-semibold mb-4">Featured Cast</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {details.credits.cast.slice(0, 8).map(actor => (
                      <div key={actor.cast_id} className="text-center">
                        <img
                          src={actor.profile_path ? `${IMAGE_BASE_URL}${actor.profile_path}` : 'https://via.placeholder.com/150x200/374151/9ca3af?text=No+Image'}
                          alt={actor.name}
                          className="w-20 h-24 rounded-lg object-cover mx-auto mb-2 border border-white/30 hover:scale-105 transition-transform"
                        />
                        <p className="text-white text-sm font-medium line-clamp-1">{actor.name}</p>
                        <p className="text-gray-400 text-xs line-clamp-1">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* TV Show Seasons */}
              {details.seasons && (
                <div className="mb-8">
                  <h3 className="text-white text-xl font-semibold mb-4">Seasons</h3>
                  <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-lg p-4 max-h-60 overflow-y-auto custom-scrollbar">
                    {details.seasons.filter(season => season.air_date).map(season => (
                      <div key={season.id} className="flex justify-between items-center text-sm text-gray-200 py-3 border-b border-white/10 last:border-b-0">
                        <div>
                          <span className="font-medium">{season.name}</span>
                          {season.air_date && (
                            <span className="text-gray-400 ml-2">
                              ({new Date(season.air_date).getFullYear()})
                            </span>
                          )}
                        </div>
                        <span className="text-gray-300">{season.episode_count} Episodes</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {!recLoading && recTabs.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-xl font-semibold">More Like This</h3>
                    {recTabs.length > 1 && (
                      <div className="flex bg-black/40 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden">
                        {recTabs.map(tab => (
                          <button 
                            key={tab.key}
                            onClick={() => setActiveRecTab(tab.key)}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                              activeRecTab === tab.key 
                                ? 'bg-white/30 text-white' 
                                : 'text-gray-300 hover:text-white hover:bg-white/20'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                    {recommendations[activeRecTab]?.slice(0, 10).map(similarItem => (
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