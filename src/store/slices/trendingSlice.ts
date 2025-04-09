import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export type MediaType = 'all' | 'movie' | 'tv';
export type TimeWindow = 'day' | 'week';

interface TrendingItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
}

interface TrendingState {
  items: TrendingItem[];
  loading: boolean;
  error: string | null;
  mediaType: MediaType;
  timeWindow: TimeWindow;
}

const initialState: TrendingState = {
  items: [],
  loading: false,
  error: null,
  mediaType: 'all',
  timeWindow: 'day'
};

export const fetchTrending = createAsyncThunk(
  'trending/fetchTrending',
  async ({ mediaType, timeWindow, page = 1 }: { mediaType: MediaType; timeWindow: TimeWindow; page?: number }) => {
    const { data } = await axios.get(`/trending/${mediaType}/${timeWindow}`, {
      params: {
        page,
        language: 'en-US'
      }
    });
    return {
      results: data.results,
      totalPages: data.total_pages
    };
  }
);

const trendingSlice = createSlice({
  name: 'trending',
  initialState,
  reducers: {
    setMediaType: (state, action) => {
      state.mediaType = action.payload;
      state.items = []; // Clear items on media type change
    },
    setTimeWindow: (state, action) => {
      state.timeWindow = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.items = [...state.items, ...action.payload.results];
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch trending items';
      });
  },
});

export const { setMediaType, setTimeWindow } = trendingSlice.actions;
export default trendingSlice.reducer;
