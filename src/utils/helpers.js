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

// Common languages for filtering
export const popularLanguages = [
  { iso_639_1: 'en', english_name: 'English', name: 'English' },
  { iso_639_1: 'es', english_name: 'Spanish', name: 'Español' },
  { iso_639_1: 'fr', english_name: 'French', name: 'Français' },
  { iso_639_1: 'de', english_name: 'German', name: 'Deutsch' },
  { iso_639_1: 'it', english_name: 'Italian', name: 'Italiano' },
  { iso_639_1: 'ja', english_name: 'Japanese', name: '日本語' },
  { iso_639_1: 'ko', english_name: 'Korean', name: '한국어/조선말' },
  { iso_639_1: 'zh', english_name: 'Mandarin', name: '普通话' },
  { iso_639_1: 'hi', english_name: 'Hindi', name: 'हिन्दी' },
  { iso_639_1: 'pt', english_name: 'Portuguese', name: 'Português' },
  { iso_639_1: 'ru', english_name: 'Russian', name: 'Pусский' },
  { iso_639_1: 'ar', english_name: 'Arabic', name: 'العربية' }
];

// Common regions/countries
export const popularRegions = [
  { iso_3166_1: 'US', english_name: 'United States' },
  { iso_3166_1: 'GB', english_name: 'United Kingdom' },
  { iso_3166_1: 'CA', english_name: 'Canada' },
  { iso_3166_1: 'FR', english_name: 'France' },
  { iso_3166_1: 'DE', english_name: 'Germany' },
  { iso_3166_1: 'IT', english_name: 'Italy' },
  { iso_3166_1: 'ES', english_name: 'Spain' },
  { iso_3166_1: 'JP', english_name: 'Japan' },
  { iso_3166_1: 'KR', english_name: 'South Korea' },
  { iso_3166_1: 'CN', english_name: 'China' },
  { iso_3166_1: 'IN', english_name: 'India' },
  { iso_3166_1: 'BR', english_name: 'Brazil' },
  { iso_3166_1: 'MX', english_name: 'Mexico' },
  { iso_3166_1: 'AU', english_name: 'Australia' }
];

// US Movie Certifications
export const usCertifications = [
  { certification: 'G', meaning: 'General Audiences' },
  { certification: 'PG', meaning: 'Parental Guidance Suggested' },
  { certification: 'PG-13', meaning: 'Parents Strongly Cautioned' },
  { certification: 'R', meaning: 'Restricted' },
  { certification: 'NC-17', meaning: 'Adults Only' }
];

// Enhanced helper functions
export const getTitle = (item) => item.title || item.name || 'Unknown Title';

export const getReleaseDate = (item) => item.release_date || item.first_air_date || '';

export const getMediaType = (item) => {
  if (item.media_type) return item.media_type;
  if (item.hasOwnProperty('title')) return 'movie';
  if (item.hasOwnProperty('name')) return 'tv';
  return 'movie';
};

export const getPosterUrl = (item, baseUrl) => {
  if (item.poster_path) {
    return `${baseUrl}${item.poster_path}`;
  }
  const title = getTitle(item).replace(/\s+/g, '+');
  return `https://via.placeholder.com/500x750/1f2937/9ca3af?text=${title}`;
};

export const getBackdropUrl = (item, baseUrl) => {
  if (item.backdrop_path) {
    return `${baseUrl}${item.backdrop_path}`;
  }
  return null;
};

export const getGenreNames = (item) => {
  return (item.genre_ids || [])
    .map(id => genreMap[id])
    .filter(Boolean)
    .slice(0, 3);
};

export const getRatingColor = (rating) => {
  if (rating >= 8.5) return 'text-emerald-400';
  if (rating >= 7.0) return 'text-yellow-400';
  if (rating >= 5.0) return 'text-orange-400';
  return 'text-red-400';
};

export const getRatingBg = (rating) => {
  if (rating >= 8.5) return 'bg-emerald-500/20 border-emerald-500/30';
  if (rating >= 7.0) return 'bg-yellow-500/20 border-yellow-500/30';
  if (rating >= 5.0) return 'bg-orange-500/20 border-orange-500/30';
  return 'bg-red-500/20 border-red-500/30';
};

export const getGradientForRating = (rating) => {
  if (rating >= 8.5) return 'from-emerald-500 to-green-600';
  if (rating >= 7.0) return 'from-yellow-500 to-orange-500';
  if (rating >= 5.0) return 'from-orange-500 to-red-500';
  return 'from-red-500 to-red-700';
};

export const formatPopularity = (popularity) => {
  if (popularity >= 1000000) return `${(popularity / 1000000).toFixed(1)}M`;
  if (popularity >= 1000) return `${(popularity / 1000).toFixed(1)}K`;
  return Math.round(popularity || 0);
};

export const formatRuntime = (minutes) => {
  if (!minutes) return 'Unknown';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes}m`;
  return `${hours}h ${remainingMinutes}m`;
};

export const formatReleaseDate = (dateString) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const calculateAverageRating = (items) => {
  if (!items || items.length === 0) return 0;
  const sum = items.reduce((acc, item) => acc + (item.vote_average || 0), 0);
  return (sum / items.length).toFixed(1);
};

export const getLanguageName = (languageCode) => {
  const language = popularLanguages.find(lang => lang.iso_639_1 === languageCode);
  return language ? language.english_name : languageCode?.toUpperCase();
};

export const getRegionName = (regionCode) => {
  const region = popularRegions.find(reg => reg.iso_3166_1 === regionCode);
  return region ? region.english_name : regionCode;
};

export const getCertificationMeaning = (certification) => {
  const cert = usCertifications.find(c => c.certification === certification);
  return cert ? cert.meaning : certification;
};

// AI suggestion prompts
export const movieSuggestionPrompts = [
  'A heartwarming story about friendship and adventure',
  'Dark psychological thriller with plot twists',
  'Romantic comedy set in a big city',
  'Epic fantasy adventure with magical creatures',
  'Intense action movie with car chases',
  'Coming-of-age drama about teenagers',
  'Space exploration science fiction',
  'Historical drama set during World War II',
  'Horror movie with supernatural elements',
  'Musical with memorable songs and dance numbers',
  'Time travel adventure with comedic elements',
  'Detective mystery in a noir setting',
  'Superhero movie with complex characters',
  'Animated adventure for the whole family',
  'Dystopian future with rebellion themes'
];

export const generateRandomSuggestion = () => {
  const randomIndex = Math.floor(Math.random() * movieSuggestionPrompts.length);
  return movieSuggestionPrompts[randomIndex];
};