import React, { useState, useEffect } from 'react';
import { X, Star, Calendar, Tv, Film, ChevronDown, CheckCircle } from 'lucide-react';
import { tmdbApi, IMAGE_BASE_URL, BACKDROP_BASE_URL } from '../services/tmdbApi';
import { getTitle, getReleaseDate, getPosterUrl, getRatingColor } from '../utils/helpers';

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

const EpisodeCard = ({ episode }) => (
  <div className="flex gap-4 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
    <img 
      src={episode.still_path ? `${IMAGE_BASE_URL}${episode.still_path}` : 'https://via.placeholder.com/150x84?text=No+Image'}
      alt={episode.name}
      className="w-36 h-20 object-cover rounded-md flex-shrink-0 bg-white/10"
    />
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-white">
        E{episode.episode_number}: {episode.name}
      </h4>
      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{episode.overview || "No overview available."}</p>
      <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
        <Star size={12} className={getRatingColor(episode.vote_average)} />
        <span>{episode.vote_average > 0 ? `${episode.vote_average.toFixed(1)}/10` : 'No rating'}</span>
        {episode.air_date && <><span className="text-gray-600">•</span><span>{episode.air_date}</span></>}
      </div>
    </div>
  </div>
);


const DetailsModal = ({ item, details, loading, onClose, onCardClick }) => {
  const [recommendations, setRecommendations] = useState({ collection: [], similar: [] });
  const [recLoading, setRecLoading] = useState(false);
  const [activeRecTab, setActiveRecTab] = useState('similar');
  
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [seasonLoading, setSeasonLoading] = useState(false);

  useEffect(() => {
    if (details) {
      if (details.seasons) {
        const defaultSeason = details.seasons.find(s => s.season_number > 0 && s.episode_count > 0) || details.seasons[0];
        if (defaultSeason) {
          setSelectedSeason(defaultSeason.season_number);
        }
      } else {
        setSelectedSeason(null);
      }
      setSeasonDetails(null);
      fetchRecommendations();
    }
  }, [details]);
  
  const fetchRecommendations = async () => {
    if (!details) return;
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

  useEffect(() => {
    const fetchSeasonDetails = async () => {
      if (details && selectedSeason !== null) {
        setSeasonLoading(true);
        try {
          const data = await tmdbApi.getSeasonDetails(details.id, selectedSeason);
          setSeasonDetails(data);
        } catch (error) {
          console.error("Failed to fetch season details:", error);
        } finally {
          setSeasonLoading(false);
        }
      }
    };
    fetchSeasonDetails();
  }, [details, selectedSeason]);

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
          backgroundImage: backdropUrl ? `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${backdropUrl})` : 'none',
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

            <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-black/40 md:bg-transparent">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h2>
              
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-gray-400 text-sm mb-4">
                {releaseYear && <span><Calendar className="inline w-4 h-4 mr-1" />{releaseYear}</span>}
                {details.runtime && <span><Film className="inline w-4 h-4 mr-1" />{details.runtime} min</span>}
                {details.number_of_seasons && <span><Tv className="inline w-4 h-4 mr-1" />{details.number_of_seasons} Seasons</span>}
                {details.status && <span><CheckCircle size={14} className="inline mr-1" />{details.status}</span>}
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
                <div className="mb-8">
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
                </div>
              )}
              
              {details.seasons && details.seasons.filter(s => s.episode_count > 0).length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-lg font-semibold">Seasons & Episodes</h3>
                    <div className="relative">
                      <select
                        value={selectedSeason || ''}
                        onChange={(e) => setSelectedSeason(Number(e.target.value))}
                        className="glass-effect pl-4 pr-10 py-2 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                      >
                        {details.seasons
                          .filter(s => s.season_number > 0 && s.episode_count > 0)
                          .map(season => (
                            <option key={season.id} value={season.season_number} className="bg-slate-800">
                              {season.name}
                            </option>
                        ))}
                      </select>
                      <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {seasonLoading ? (
                    <div className="text-center p-4">
                      <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                      {seasonDetails?.episodes.map(episode => (
                        <EpisodeCard key={episode.id} episode={episode} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!recLoading && recTabs.length > 0 && (
                <div>
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