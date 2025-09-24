// Genre mapping from TMDB API
export const genreMap = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

// Helper functions
export const getTitle = (item) => item.title || item.name || 'Unknown Title';

export const getReleaseDate = (item) => item.release_date || item.first_air_date || '';

export const getMediaType = (item) => {
  if (item.media_type) return item.media_type;
  if (item.hasOwnProperty('title')) return 'movie';
  if (item.hasOwnProperty('name')) return 'tv';
  return 'movie'; // Default to movie if unsure
};

export const getPosterUrl = (item, baseUrl) => {
  if (item.poster_path) {
    return `${baseUrl}${item.poster_path}`;
  }
  // A more consistent placeholder
  const title = getTitle(item).replace(/\s+/g, '+');
  return `https://via.placeholder.com/500x750.png?text=${title}`;
};

export const getGenreNames = (item) => {
  return (item.genre_ids || [])
    .map(id => genreMap[id])
    .filter(Boolean)
    .slice(0, 2);
};

export const getRatingColor = (rating) => {
  if (rating >= 8.5) return 'text-green-400';
  if (rating >= 7.0) return 'text-yellow-400';
  return 'text-red-400';
};

export const getRatingBg = (rating) => {
  if (rating >= 8.5) return 'bg-green-500/20 border-green-500/30';
  if (rating >= 7.0) return 'bg-yellow-500/20 border-yellow-500/30';
  return 'bg-red-500/20 border-red-500/30';
};

export const formatPopularity = (popularity) => {
  return Math.round(popularity || 0);
};

export const calculateAverageRating = (items) => {
  if (!items || items.length === 0) return 0;
  const sum = items.reduce((acc, item) => acc + (item.vote_average || 0), 0);
  return (sum / items.length).toFixed(1);
};