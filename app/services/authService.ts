const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const ACCOUNT_ID = import.meta.env.VITE_TMDB_ACCOUNT_ID;
const BASE_URL = 'https://api.themoviedb.org/3';

export const tmdbFetch = async (endpoint: string, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('TMDB Fetch Error:', error);
    throw error;
  }
};

export const authService = {
  // For endpoints that require API key
  async getMovie(movieId: string) {
    return tmdbFetch(`/movie/${movieId}?api_key=${API_KEY}`);
  },

  // For endpoints that use Bearer token
  async rateMovie(movieId: string, rating: number) {
    return tmdbFetch(`/movie/${movieId}/rating`, {
      method: 'POST',
      body: JSON.stringify({ value: rating })
    });
  },

  // Step 1: Create request token
  async createRequestToken() {
    const response = await fetch(
      `${BASE_URL}/authentication/token/new?api_key=${API_KEY}`
    );
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('request_token', data.request_token);
      return data.request_token;
    }
    throw new Error('Failed to create request token');
  },

  // Step 2: Generate auth URL
  getAuthURL(requestToken: string) {
    return `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${REDIRECT_URL}`;
  },

  // Step 3: Create session ID
  async createSession(requestToken: string) {
    const response = await fetch(
      `${BASE_URL}/authentication/session/new?api_key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request_token: requestToken }),
      }
    );
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('session_id', data.session_id);
      return data.session_id;
    }
    throw new Error('Failed to create session');
  },

  // Get account details
  async getAccount(sessionId: string) {
    const response = await fetch(
      `${BASE_URL}/account?api_key=${API_KEY}&session_id=${sessionId}`
    );
    const data = await response.json();
    return data;
  },

  async getAccountDetails() {
    const response = await fetch(`${BASE_URL}/account`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    if (data.id) {
      // Store account ID in env or localStorage
      localStorage.setItem('tmdb_account_id', data.id.toString());
      return data.id;
    }
    throw new Error('Failed to get account ID');
  }
};

// Call this when your app starts
export const initializeTMDB = async () => {
  try {
    const accountId = await authService.getAccountDetails();
    console.log('Your TMDB Account ID:', accountId);
    // You can add this to your .env file
  } catch (error) {
    console.error('Error getting account ID:', error);
  }
};
