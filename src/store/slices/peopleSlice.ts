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

export const fetchPeople = createAsyncThunk(
  'people/fetchPeople',
  async (page: number = 1) => {
    const { data } = await axios.get('person/popular', {
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
        // Create a Set to track unique IDs
        const uniqueIds = new Set(state.items.map(item => item.id));
        
        // Filter out duplicates from new results
        const newItems = action.payload.results.filter(item => !uniqueIds.has(item.id));
        
        state.items = [...state.items, ...newItems];
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
