import { configureStore } from '@reduxjs/toolkit';
import featuredReducer from './slices/featuredSlice';

export const store = configureStore({
  reducer: {
    // ...existing reducers...
    featured: featuredReducer,
  },
  // ...existing code...
});