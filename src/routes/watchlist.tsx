import { useEffect } from "react";
import { motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchWatchlist } from "../store/slices/userActionsSlice";
import Card from "../components/Card";
import Layout from "../components/shared/Layout";
import type { WatchlistItem } from "../store/slices/userActionsSlice"; // Import the type

export default function WatchlistPage() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.userActions);
  const watchlist =
    useAppSelector((state) => state.userActions.watchlist) || [];

  useEffect(() => {
    dispatch(fetchWatchlist());
  }, [dispatch]);

  return (
    <Layout>
      <div className="container mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">
            My Watchlist ({watchlist?.length || 0})
          </h1>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-4 text-red-500 rounded bg-red-100/10">
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
          </div>
        ) : watchlist?.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center"
          >
            {watchlist.map((movie) => (
              <div
                key={movie.id || movie.mediaId}
                className="movie-card w-full flex justify-center"
              >
                <Card
                  id={movie.mediaId || movie.id}
                  poster_path={movie.poster_path || ""}
                  title={movie.title || ""}
                  name={movie.name || ""}
                  media_type={movie.mediaType || "movie"}
                  vote_average={movie.vote_average}
                  release_date={movie.release_date}
                  first_air_date={movie.first_air_date}
                  isBookmarked={true}
                />
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 text-gray-400"
          >
            <p className="text-xl">Your watchlist is empty</p>
            <p className="mt-2 text-sm">
              Start adding movies by clicking the bookmark icon on any movie
              card
            </p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
