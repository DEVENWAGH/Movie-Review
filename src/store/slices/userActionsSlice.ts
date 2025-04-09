import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserRatings } from '../../services/tmdbApi';

export const addToWatchlist = createAsyncThunk(
  'userActions/addToWatchlist',
  async ({ mediaId, mediaType, watchlist }, { dispatch }) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/account/${import.meta.env.VITE_TMDB_ACCOUNT_ID}/watchlist`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          media_type: mediaType,
          media_id: mediaId,
          watchlist
        })
      }
    );
    const data = await response.json();
    if (data.success) {
      // Fetch updated watchlist after successful addition/removal
      dispatch(fetchWatchlist());
    }
    return { mediaId, success: data.success };
  }
);

export const rateMedia = createAsyncThunk(
  'userActions/rate',
  async ({ mediaId, mediaType, rating }: { mediaId: number; mediaType: string; rating: number }) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${mediaId}/rating`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: rating })
      }
    );
    const data = await response.json();
    return { mediaId, rating, success: data.success };
  }
);

export const fetchWatchlist = createAsyncThunk(
  'userActions/fetchWatchlist',
  async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/account/${import.meta.env.VITE_TMDB_ACCOUNT_ID}/watchlist/movies?language=en-US&page=1&sort_by=created_at.desc`,
      {
        headers: {
          accept: 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.status_message || 'Failed to fetch watchlist');
    }

    const data = await response.json();
    return data.results || [];
  }
);

export const fetchUserRatings = createAsyncThunk(
  'userActions/fetchUserRatings',
  async () => {
    const ratings = await getUserRatings();
    return ratings.map(item => ({
      mediaId: item.id,
      rating: Math.round(item.rating / 2) // Convert 10-point to 5-point scale
    }));
  }
);

const userActionsSlice = createSlice({
  name: 'userActions',
  initialState: {
    watchlist: new Set<number>(),
    watchlistItems: [],
    ratings: new Map<number, number>(),
    loading: false,
    error: null
  },
  reducers: {
    addToRatings: (state, action) => {
      state.ratings.set(action.payload.mediaId, action.payload.rating);
    },
    addToWatchlistSet: (state, action) => {
      if (state.watchlist.has(action.payload)) {
        state.watchlist.delete(action.payload);
      } else {
        state.watchlist.add(action.payload);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          const currentValue = state.watchlist.has(action.payload.mediaId);
          if (currentValue) {
            state.watchlist.delete(action.payload.mediaId);
            state.watchlistItems = state.watchlistItems.filter(
              item => item.id !== action.payload.mediaId
            );
          } else {
            state.watchlist.add(action.payload.mediaId);
          }
        }
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update watchlist';
      })
      .addCase(rateMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rateMedia.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.ratings.set(action.payload.mediaId, action.payload.rating);
        }
      })
      .addCase(rateMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to rate';
      })
      .addCase(fetchWatchlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.watchlistItems = action.payload;
        state.watchlist = new Set(action.payload.map(item => item.id));
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserRatings.fulfilled, (state, action) => {
        action.payload.forEach(({ mediaId, rating }) => {
          state.ratings.set(mediaId, rating);
        });
      });
  }
});

export const { addToRatings, addToWatchlistSet } = userActionsSlice.actions;
export default userActionsSlice.reducer;
