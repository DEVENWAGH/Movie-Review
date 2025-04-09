import { useEffect } from "react";
import { motion } from "motion/react"
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchWatchlist } from "../store/slices/userActionsSlice";
import Card from "../components/Card";
import Layout from "../components/shared/Layout";

export default function WatchlistPage() {
  const dispatch = useAppDispatch();
  const { watchlistItems, loading, error } = useAppSelector(
    (state) => state.userActions
  );

  useEffect(() => {
    dispatch(fetchWatchlist());
  }, [dispatch]);

  return (
    <Layout>
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">
            My Watchlist ({watchlistItems?.length || 0})
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
        ) : watchlistItems?.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {watchlistItems.map((movie) => (
              <Card
                key={movie.id}
                {...movie}
                media_type="movie"
                isBookmarked={true}
              />
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
