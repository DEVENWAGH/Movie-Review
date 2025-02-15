import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import type { RootState } from '../store';

interface DetailsState {
  details: any;
  credits: any;
  similar: any[];
  videos: any[];
  providers: any;
  loading: boolean;
  error: string | null;
  translations: any[];
  recommendations: any[];
}

interface FetchDetailsParams {
  mediaType: string;
  id: string;
}

const initialState: DetailsState = {
  details: null,
  credits: null,
  similar: [],
  videos: [],
  providers: null,
  loading: false,
  error: null,
  translations: [],
  recommendations: [],
};

export const fetchDetails = createAsyncThunk(
  'details/fetchDetails',
  async ({ mediaType, id }, { getState }) => {
    try {
      const state = getState();
      const region = state.region.region;

      const [details, credits, similar, hindiVideos, englishVideos, providers, translations, recommendations] = await Promise.all([
        axios.get(`/${mediaType}/${id}`),
        axios.get(`/${mediaType}/${id}/credits`),
        axios.get(`/${mediaType}/${id}/similar`),
        // Get Hindi videos
        axios.get(`/${mediaType}/${id}/videos`, {
          params: { language: 'hi' }
        }),
        // Get English videos (as fallback)
        axios.get(`/${mediaType}/${id}/videos`, {
          params: { language: 'en' }
        }),
        axios.get(`/${mediaType}/${id}/watch/providers`, {
          params: { region }
        }),
        axios.get(`/${mediaType}/${id}/translations`),
        axios.get(`/${mediaType}/${id}/recommendations`),
      ]);

      // Combine videos with preference to Hindi if region is India
      const videos = region === 'IN' 
        ? [...hindiVideos.data.results, ...englishVideos.data.results]
        : [...englishVideos.data.results, ...hindiVideos.data.results];

      return {
        details: details.data,
        credits: credits.data,
        similar: similar.data.results,
        videos,
        providers: providers.data.results,
        translations: translations.data.translations,
        recommendations: recommendations.data.results,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch details');
    }
  }
);

const detailsSlice = createSlice({
  name: 'details',
  initialState,
  reducers: {
    resetDetails: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDetails.fulfilled, (state, action) => {
        state.details = action.payload.details;
        state.credits = action.payload.credits;
        state.similar = action.payload.similar;
        state.videos = action.payload.videos;
        state.providers = action.payload.providers;
        state.translations = action.payload.translations;
        state.recommendations = action.payload.recommendations;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch details';
      });
  },
});

export const { resetDetails } = detailsSlice.actions;
export default detailsSlice.reducer;
