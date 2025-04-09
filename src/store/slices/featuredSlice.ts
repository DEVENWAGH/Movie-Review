import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

interface FeaturedState {
  item: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: FeaturedState = {
  item: null,
  loading: false,
  error: null
};

export const fetchFeatured = createAsyncThunk(
  'featured/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      // First, get trending movies/shows
      const response = await axios.get(
        `${BASE_URL}/trending/all/day?api_key=${TMDB_API_KEY}&language=en-US`
      );
      
      // Select a high-quality item (one with a backdrop and good rating)
      const items = response.data.results;
      const filteredItems = items.filter(
        (item: any) => 
          item.backdrop_path && 
          item.overview &&
          item.vote_average > 7.0
      );
      
      // Get a random item from the filtered list or the first item if no good matches
      const randomIndex = Math.floor(Math.random() * Math.min(5, filteredItems.length));
      const selectedItem = filteredItems[randomIndex] || items[0];
      
      // Get more details for the selected item
      const detailsResponse = await axios.get(
        `${BASE_URL}/${selectedItem.media_type}/${selectedItem.id}?api_key=${TMDB_API_KEY}&language=en-US`
      );
      
      return { ...selectedItem, ...detailsResponse.data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch featured content');
    }
  }
);

const featuredSlice = createSlice({
  name: 'featured',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatured.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeatured.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload;
      })
      .addCase(fetchFeatured.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default featuredSlice.reducer;
