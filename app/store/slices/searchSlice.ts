import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import type { SearchResult } from '../../types/search';

interface SearchState {
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  query: '',
  results: [],
  loading: false,
  error: null,
};

export const searchMulti = createAsyncThunk(
  'search/searchMulti',
  async (query: string) => {
    const { data } = await axios.get(`/search/multi?query=${query}`);
    return data.results;
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMulti.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchMulti.fulfilled, (state, action) => {
        state.results = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(searchMulti.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to search';
      });
  },
});

export const { setQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
