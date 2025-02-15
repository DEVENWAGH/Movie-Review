import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserLocation } from '../../utils/location';

interface RegionState {
  region: string;
  loading: boolean;
  error: string | null;
}

const initialState: RegionState = {
  region: 'IN',
  loading: false,
  error: null,
};

export const detectRegion = createAsyncThunk(
  'region/detect',
  async () => {
    return await getUserLocation();
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
      .addCase(detectRegion.pending, (state) => {
        state.loading = true;
      })
      .addCase(detectRegion.fulfilled, (state, action) => {
        state.region = action.payload;
        state.loading = false;
      })
      .addCase(detectRegion.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to detect region';
      });
  },
});

export const { setRegion } = regionSlice.actions;
export default regionSlice.reducer;
