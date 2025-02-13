import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export type MediaType = 'movie' | 'tv';

interface PopularState {
  items: any[];
  loading: boolean;
  error: string | null;
  mediaType: MediaType;
  currentPage: number;
  totalPages: number;
}

const initialState: PopularState = {
  items: [],
  loading: false,
  error: null,
  mediaType: 'movie',
  currentPage: 1,
  totalPages: 1
};

export const fetchPopular = createAsyncThunk(
  'popular/fetchPopular',
  async ({ mediaType, page }: { mediaType: MediaType; page: number }) => {
    const { data } = await axios.get(`/${mediaType}/popular?page=${page}`);
    return {
      results: data.results,
      totalPages: data.total_pages
    };
  }
);

const popularSlice = createSlice({
  name: 'popular',
  initialState,
  reducers: {
    setMediaType: (state, action) => {
      state.mediaType = action.payload;
      state.items = [];
      state.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopular.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPopular.fulfilled, (state, action) => {
        if (state.currentPage === 1) {
          state.items = action.payload.results;
        } else {
          state.items = [...state.items, ...action.payload.results];
        }
        state.totalPages = action.payload.totalPages;
        state.currentPage += 1;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPopular.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch popular items';
      });
  },
});

export const { setMediaType } = popularSlice.actions;
export default popularSlice.reducer;
