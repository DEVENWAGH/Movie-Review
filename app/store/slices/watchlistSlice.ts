import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchWatchlist = createAsyncThunk(
  'watchlist/fetch',
  async (accountId: string) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/account/${accountId}/watchlist/movies`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
        }
      }
    );
    const data = await response.json();
    return data.results;
  }
);

export const addToWatchlist = createAsyncThunk(
  'watchlist/add',
  async ({ accountId, mediaId, mediaType }: { accountId: string, mediaId: number, mediaType: string }) => {
    await fetch(
      `https://api.themoviedb.org/3/account/${accountId}/watchlist`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          media_type: mediaType,
          media_id: mediaId,
          watchlist: true
        })
      }
    );
    return mediaId;
  }
);

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    // Add cases for handling async actions
    // ...
  }
});

export default watchlistSlice.reducer;
