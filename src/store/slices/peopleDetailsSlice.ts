import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

interface PeopleDetailsState {
  details: any;
  credits: any[];
  loading: boolean;
  error: string | null;
}

const initialState: PeopleDetailsState = {
  details: null,
  credits: [],
  loading: false,
  error: null
};

export const fetchPeopleDetails = createAsyncThunk(
  'peopleDetails/fetchPeopleDetails',
  async (id: string) => {
    const [detailsResponse, creditsResponse, externalIdsResponse] = await Promise.all([
      axios.get(`person/${id}`, {
        params: { language: 'en-US' }
      }),
      axios.get(`person/${id}/combined_credits`, {
        params: { language: 'en-US' }
      }),
      axios.get(`person/${id}/external_ids`)
    ]);
    
    return {
      details: {
        ...detailsResponse.data,
        external_ids: externalIdsResponse.data
      },
      credits: creditsResponse.data
    };
  }
);

const peopleDetailsSlice = createSlice({
  name: 'peopleDetails',
  initialState,
  reducers: {
    resetState: (state) => {
      state.details = null;
      state.credits = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPeopleDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPeopleDetails.fulfilled, (state, action) => {
        state.details = action.payload.details;
        state.credits = action.payload.credits;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPeopleDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch person details';
      });
  },
});

export const { resetState } = peopleDetailsSlice.actions;
export default peopleDetailsSlice.reducer;
