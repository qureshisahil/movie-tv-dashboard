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

  // Enhanced discover with all filters
  discover: async (filters) => {
    try {
      let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}`;
      
      // Basic filters
      if (filters.sortBy) url += `&sort_by=${filters.sortBy}`;
      if (filters.genreId && filters.genreId !== 'all') url += `&with_genres=${filters.genreId}`;
      
      // New advanced filters
      if (filters.originalLanguage && filters.originalLanguage !== 'all') {
        url += `&with_original_language=${filters.originalLanguage}`;
      }
      if (filters.region && filters.region !== 'all') {
        url += `&region=${filters.region}`;
      }
      if (filters.certification && filters.certification !== 'all') {
        url += `&certification=${filters.certification}&certification_country=US`;
      }
      if (filters.releaseYear) {
        url += `&primary_release_year=${filters.releaseYear}`;
      }
      if (filters.minRating) {
        url += `&vote_average.gte=${filters.minRating}`;
      }
      if (filters.maxRating) {
        url += `&vote_average.lte=${filters.maxRating}`;
      }
      if (filters.minRuntime) {
        url += `&with_runtime.gte=${filters.minRuntime}`;
      }
      if (filters.maxRuntime) {
        url += `&with_runtime.lte=${filters.maxRuntime}`;
      }
      if (filters.minVotes) {
        url += `&vote_count.gte=${filters.minVotes}`;
      }
      if (filters.keywords) {
        url += `&with_keywords=${filters.keywords}`;
      }
      if (filters.companies) {
        url += `&with_companies=${filters.companies}`;
      }
      if (filters.cast) {
        url += `&with_cast=${filters.cast}`;
      }
      if (filters.crew) {
        url += `&with_crew=${filters.crew}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch discover data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching discover data:', error);
      throw error;
    }
  },

  // AI-powered movie suggestions based on description
  suggestMoviesByDescription: async (description) => {
    try {
      // First, search for keywords related to the description
      const keywordResponse = await fetch(
        `${BASE_URL}/search/keyword?api_key=${API_KEY}&query=${encodeURIComponent(description)}`
      );
      
      if (keywordResponse.ok) {
        const keywordData = await keywordResponse.json();
        if (keywordData.results.length > 0) {
          // Use the top keywords to discover movies
          const keywordIds = keywordData.results.slice(0, 3).map(k => k.id).join(',');
          return await tmdbApi.discover({ keywords: keywordIds });
        }
      }

      // Fallback to multi-search if keyword search doesn't work
      return await tmdbApi.searchMulti(description);
    } catch (error) {
      console.error('Error getting movie suggestions:', error);
      throw error;
    }
  },

  getMovieDetails: async (movieId) => {
    try {
      const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos,keywords,similar,recommendations`);
      if (!response.ok) throw new Error('Failed to fetch movie details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  getTVDetails: async (tvId) => {
    try {
      const response = await fetch(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&append_to_response=credits,videos,keywords,similar,recommendations`);
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

  // Get configuration data for filters
  getConfiguration: async () => {
    try {
      const response = await fetch(`${BASE_URL}/configuration?api_key=${API_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch configuration');
      return await response.json();
    } catch (error) {
      console.error('Error fetching configuration:', error);
      throw error;
    }
  },

  // Get available languages
  getLanguages: async () => {
    try {
      const response = await fetch(`${BASE_URL}/configuration/languages?api_key=${API_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch languages');
      return await response.json();
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw error;
    }
  },

  // Get available countries
  getCountries: async () => {
    try {
      const response = await fetch(`${BASE_URL}/configuration/countries?api_key=${API_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch countries');
      return await response.json();
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  },

  // Search for people (actors, directors)
  searchPerson: async (query) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error('Failed to search people');
      return await response.json();
    } catch (error) {
      console.error('Error searching people:', error);
      throw error;
    }
  },

  // Search for companies
  searchCompany: async (query) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search/company?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error('Failed to search companies');
      return await response.json();
    } catch (error) {
      console.error('Error searching companies:', error);
      throw error;
    }
  }
};