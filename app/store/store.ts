import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './slices/movieSlice';
import searchReducer from './slices/searchSlice';
import languageReducer from './slices/languageSlice';

export const store = configureStore({
  reducer: {
    movie: movieReducer,
    search: searchReducer,
    language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
