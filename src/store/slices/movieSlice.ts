import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

interface MovieState {
  wallpaper: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  wallpaper: null,
  loading: false,
  error: null,
};

export const fetchWallpaper = createAsyncThunk(
  'movie/fetchWallpaper',
  async () => {
    const { data } = await axios.get('/trending/all/day');
    const randomIndex = Math.floor(Math.random() * data.results.length);
    return data.results[randomIndex];
  }
);

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallpaper.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWallpaper.fulfilled, (state, action) => {
        state.wallpaper = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchWallpaper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch wallpaper';
      });
  },
});

export default movieSlice.reducer;
