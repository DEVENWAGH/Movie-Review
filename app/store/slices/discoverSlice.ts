import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export type MediaType = 'movie' | 'tv';

interface DiscoverState {
  items: any[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  sortBy: string;
}

const initialState: DiscoverState = {
  items: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  sortBy: 'popularity.desc'
};

export const fetchDiscover = createAsyncThunk(
  'discover/fetchDiscover',
  async ({ mediaType, page = 1, sortBy }: { mediaType: MediaType; page?: number; sortBy: string }) => {
    const { data } = await axios.get(`/discover/${mediaType}`, {
      params: {
        page,
        sort_by: sortBy,
        language: 'en-US'
      }
    });
    return {
      results: data.results,
      totalPages: data.total_pages
    };
  }
);

const discoverSlice = createSlice({
  name: 'discover',
  initialState,
  reducers: {
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.items = [];
      state.currentPage = 1;
      state.totalPages = 1;
    },
    resetState: (state) => {
      state.items = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscover.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDiscover.fulfilled, (state, action) => {
        state.items = state.currentPage === 1 
          ? action.payload.results 
          : [...state.items, ...action.payload.results];
        state.totalPages = action.payload.totalPages;
        state.currentPage += 1;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchDiscover.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch discover items';
      });
  },
});

export const { setSortBy, resetState } = discoverSlice.actions;
export default discoverSlice.reducer;
