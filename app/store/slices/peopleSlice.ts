import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

interface PeopleState {
  items: any[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

const initialState: PeopleState = {
  items: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1
};

const filterInappropriateContent = (items: any[]) => {
  return items.filter(item => {
    // Filter out items with inappropriate or adult content
    const knownFor = item.known_for || [];
    const isAppropriate = knownFor.every((work: any) => 
      !work.adult && 
      (work.media_type === 'movie' || work.media_type === 'tv')
    );
    return isAppropriate && item.profile_path; // Only include items with profile images
  });
};

export const fetchPeople = createAsyncThunk(
  'people/fetchPeople',
  async (page: number = 1) => {
    const { data } = await axios.get('/person/popular', {
      params: {
        page,
        language: 'en-US'
      }
    });
    
    const filteredResults = filterInappropriateContent(data.results);
    return {
      results: filteredResults,
      totalPages: data.total_pages
    };
  }
);

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
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
      .addCase(fetchPeople.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPeople.fulfilled, (state, action) => {
        state.items = state.currentPage === 1 
          ? action.payload.results 
          : [...state.items, ...action.payload.results];
        state.totalPages = action.payload.totalPages;
        state.currentPage += 1;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPeople.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch people';
      });
  },
});

export const { resetState } = peopleSlice.actions;
export default peopleSlice.reducer;
