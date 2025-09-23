// TMDB API configuration
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';


// API service functions
export const tmdbApi = {
  // ... (getTrending, getTopRatedMovies, getTopRatedTV, searchMulti functions are unchanged)
  getTrending: async () => {
    try {
      const response = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch trending data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching trending data:', error);
      throw error;
    }
  },

  getTopRatedMovies: async () => {
    try {
      const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch top rated movies');
      return await response.json();
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  },

  getTopRatedTV: async () => {
    try {
      const response = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch top rated TV shows');
      return await response.json();
    } catch (error) {
      console.error('Error fetching top rated TV shows:', error);
      throw error;
    }
  },

  searchMulti: async (query) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error('Failed to search');
      return await response.json();
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  },

  // Get movie details with credits
  getMovieDetails: async (movieId) => {
    try {
      const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`);
      if (!response.ok) throw new Error('Failed to fetch movie details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // Get TV show details with credits
  getTVDetails: async (tvId) => {
    try {
      const response = await fetch(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&append_to_response=credits`);
      if (!response.ok) throw new Error('Failed to fetch TV details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching TV details:', error);
      throw error;
    }
  }
};