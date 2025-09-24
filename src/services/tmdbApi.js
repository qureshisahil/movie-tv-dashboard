// TMDB API configuration
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// API service functions
export const tmdbApi = {
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

  discover: async ({ genreId, sortBy }) => {
    try {
      let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sortBy}`;
      if (genreId && genreId !== 'all') {
        url += `&with_genres=${genreId}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch discover data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching discover data:', error);
      throw error;
    }
  },

  getMovieDetails: async (movieId) => {
    try {
      const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`);
      if (!response.ok) throw new Error('Failed to fetch movie details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  getTVDetails: async (tvId) => {
    try {
      const response = await fetch(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&append_to_response=credits,videos`);
      if (!response.ok) throw new Error('Failed to fetch TV details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching TV details:', error);
      throw error;
    }
  },
  
  getSimilarMovies: async (movieId) => {
    try {
      const response = await fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch similar movies');
      return await response.json();
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      throw error;
    }
  },

  getSimilarTV: async (tvId) => {
    try {
      const response = await fetch(`${BASE_URL}/tv/${tvId}/similar?api_key=${API_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch similar TV shows');
      return await response.json();
    } catch (error) {
      console.error('Error fetching similar TV shows:', error);
      throw error;
    }
  },

  getCollectionDetails: async (collectionId) => {
    try {
      const response = await fetch(`${BASE_URL}/collection/${collectionId}?api_key=${API_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch collection details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching collection details:', error);
      throw error;
    }
  },
};