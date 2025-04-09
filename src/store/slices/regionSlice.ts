import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserLocation } from '../../services/location';

interface RegionState {
  region: string;
  loading: boolean;
  error: string | null;
}

const initialState: RegionState = {
  region: 'IN', // Changed default to India
  loading: false,
  error: null,
};

export const initializeRegion = createAsyncThunk(
  'region/initialize',
  async () => {
    try {
      const region = await getUserLocation();
      return region;
    } catch (error) {
      console.error('Region initialization error:', error);
      return 'US'; // Fallback to US
    }
  }
);

const regionSlice = createSlice({
  name: 'region',
  initialState,
  reducers: {
    setRegion: (state, action) => {
      state.region = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeRegion.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeRegion.fulfilled, (state, action) => {
        state.region = action.payload;
        state.loading = false;
      })
      .addCase(initializeRegion.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to detect region';
      });
  },
});

export const { setRegion } = regionSlice.actions;
export default regionSlice.reducer;
