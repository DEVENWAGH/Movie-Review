import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';

import movieReducer from './slices/movieSlice';
import searchReducer from './slices/searchSlice';
import languageReducer from './slices/languageSlice';
import trendingReducer from './slices/trendingSlice';
import popularReducer from './slices/popularSlice';
import discoverReducer from './slices/discoverSlice';
import peopleReducer from './slices/peopleSlice';
import detailsReducer from './slices/detailsSlice';
import regionReducer from './slices/regionSlice';
import peopleDetailsReducer from './slices/peopleDetailsSlice';
import userActionsReducer from './slices/userActionsSlice';
import featuredReducer from './slices/featuredSlice';

// Enable MapSet support
enableMapSet();

export const store = configureStore({
  reducer: {
    movie: movieReducer,
    search: searchReducer,
    language: languageReducer,
    trending: trendingReducer,
    popular: popularReducer,
    discover: discoverReducer,
    people: peopleReducer,
    peopleDetails: peopleDetailsReducer,
    details: detailsReducer,
    region: regionReducer,
    userActions: userActionsReducer,
    featured: featuredReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state
        ignoredActions: ['userActions/setRatings', 'userActions/setWatchlist'],
        ignoredPaths: ['userActions.ratings', 'userActions.watchlist'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
