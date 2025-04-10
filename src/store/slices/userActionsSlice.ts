import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserRatings } from '../../services/tmdbApi';

// Define proper interfaces
export interface WatchlistItem {
  id: number;
  mediaId: number;
  mediaType: string;
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
}

interface UserActionsState {
  watchlist: WatchlistItem[];
  ratings: any[];
  loading: boolean;
  error: string | null;
}

const initialState: UserActionsState = {
  watchlist: [],
  ratings: [],
  loading: false,
  error: null,
};

export const addToWatchlist = createAsyncThunk(
  'userActions/addToWatchlist',
  async (payload: { mediaId: number; mediaType: string; watchlist: boolean }, { dispatch }) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/account/${import.meta.env.VITE_TMDB_ACCOUNT_ID}/watchlist`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          media_type: payload.mediaType,
          media_id: payload.mediaId,
          watchlist: payload.watchlist
        })
      }
    );
    const data = await response.json();
    if (data.success) {
      // Fetch updated watchlist after successful addition/removal
      dispatch(fetchWatchlist());
    }
    return { mediaId: payload.mediaId, success: data.success, watchlist: payload.watchlist };
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

export const addToRatings = createAsyncThunk(
  'userActions/addToRatings',
  async (payload: { mediaId: number; rating: number }) => {
    return payload;
  }
);

const userActionsSlice = createSlice({
  name: 'userActions',
  initialState,
  reducers: {
    addToWatchlistSet: (state, action: PayloadAction<number>) => {
      const index = state.watchlist.findIndex(item => item.mediaId === action.payload);
      if (index !== -1) {
        state.watchlist.splice(index, 1);
      } else {
        state.watchlist.push({ id: action.payload, mediaId: action.payload, mediaType: '' });
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
          if (action.payload.watchlist === false) {
            state.watchlist = state.watchlist.filter(
              item => item.mediaId !== action.payload.mediaId
            );
          } else {
            state.watchlist.push({
              id: action.payload.mediaId,
              mediaId: action.payload.mediaId,
              mediaType: ''
            });
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
          state.ratings.push({ mediaId: action.payload.mediaId, rating: action.payload.rating });
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
        state.watchlist = action.payload;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null; // Use nullish coalescing to ensure null
      })
      .addCase(fetchUserRatings.fulfilled, (state, action) => {
        action.payload.forEach(({ mediaId, rating }) => {
          state.ratings.push({ mediaId, rating });
        });
      })
      .addCase(addToRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null; // Use nullish coalescing to ensure null
      });
  }
});

export const { addToWatchlistSet } = userActionsSlice.actions;
export default userActionsSlice.reducer;
