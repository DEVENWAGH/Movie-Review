import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch } from "./store/hooks";
import { initializeTMDB } from "./services/authService";
import {
  fetchWatchlist,
  fetchUserRatings,
} from "./store/slices/userActionsSlice";

// Import all the pages
import Home from "./routes/home";
import Trending from "./routes/trending";
import Popular from "./routes/popular";
import Movie from "./routes/movie";
import TV from "./routes/tv";
import Watchlist from "./routes/watchlist";
import People from "./routes/people";
import PeopleDetails from "./routes/people/details";
import Details from "./routes/details";
import AuthCallback from "./routes/auth/callback";

// Import ErrorBoundary component
import ErrorBoundary from "./components/ErrorBoundary";

function AppContent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize app data
    Promise.all([
      initializeTMDB(),
      dispatch(fetchWatchlist()),
      dispatch(fetchUserRatings()),
    ]).catch(console.error);
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/trending" element={<Trending />} />
      <Route path="/popular" element={<Popular />} />
      <Route path="/discover/movie" element={<Movie />} />
      <Route path="/discover/tv" element={<TV />} />
      <Route path="/watchlist" element={<Watchlist />} />
      <Route path="/people" element={<People />} />
      <Route path="/people/:id" element={<PeopleDetails />} />
      <Route path="/details/:mediaType/:id" element={<Details />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
