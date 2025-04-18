import { BookmarkIcon } from "@heroicons/react/24/outline";
import {
  BookmarkIcon as BookmarkSolidIcon,
  StarIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addToWatchlist,
  rateMedia,
  addToRatings,
  fetchWatchlist,
} from "../store/slices/userActionsSlice";
import { motion, AnimatePresence } from "motion/react";
import Portal from "./shared/Portal";
import { useLocation } from "react-router-dom";

interface CardProps {
  id: number;
  poster_path: string;
  title?: string;
  name?: string;
  media_type: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  isTrending?: boolean;
  isSlider?: boolean;
  showFullDate?: boolean;
  mediaType?: string;
  isBookmarked?: boolean;
}

export default function Card({
  id,
  poster_path,
  title,
  name,
  media_type,
  vote_average,
  release_date,
  first_air_date,
  isSlider,
  showFullDate,
  mediaType,
  isBookmarked: defaultIsBookmarked,
}: Readonly<CardProps>) {
  const dispatch = useAppDispatch();
  const watchlist = useAppSelector((state) => state.userActions.watchlist);
  const location = useLocation();
  const isWatchlistPage = location.pathname === "/watchlist";

  // Enhanced watchlist check - handle both direct ID match and mediaId match
  const isInWatchlist = watchlist.some(
    (item) => item.mediaId === id || item.id === id
  );

  // On watchlist page, always use true; elsewhere use redux state unless prop is provided
  const isBookmarked = isWatchlistPage
    ? true
    : typeof defaultIsBookmarked !== "undefined"
    ? defaultIsBookmarked
    : isInWatchlist;

  // Handle missing poster path
  const imageSrc = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/logo.svg"; // Fallback image

  const userRating =
    useAppSelector(
      (state) =>
        state.userActions.ratings.find((item) => item.mediaId === id)?.rating
    ) || 0;
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const resolvedMediaType = mediaType ?? media_type ?? (title ? "movie" : "tv");

  const formatDate = (date?: string) => {
    if (!date) return "";
    return showFullDate
      ? new Date(date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : new Date(date).getFullYear();
  };

  const handleBookmark = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        // When on watchlist page and removing, we want to force "false" regardless of current state
        const newBookmarkState = isWatchlistPage ? false : !isBookmarked;

        await dispatch(
          addToWatchlist({
            mediaId: id,
            mediaType: resolvedMediaType,
            watchlist: newBookmarkState,
          })
        ).unwrap();

        // On watchlist page, refresh the watchlist to update UI
        if (isWatchlistPage) {
          dispatch(fetchWatchlist());
        }
      } catch (error) {
        console.error("Failed to update watchlist:", error);
      }
    },
    [dispatch, id, resolvedMediaType, isBookmarked, isWatchlistPage]
  );

  const handleRating = async (rating: number) => {
    try {
      const response = await dispatch(
        rateMedia({
          mediaId: id,
          mediaType: resolvedMediaType,
          rating: rating * 2,
        })
      ).unwrap();

      if (response.success) {
        dispatch(addToRatings({ mediaId: id, rating }));
        setIsRatingOpen(false);
      }
    } catch (error) {
      console.error("Failed to rate:", error);
    }
  };

  const handleRemoveRating = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/${resolvedMediaType}/${id}/rating`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        dispatch(addToRatings({ mediaId: id, rating: 0 }));
        setIsRatingOpen(false);
      }
    } catch (error) {
      console.error("Failed to remove rating:", error);
    }
  };

  const getStarColor = (star: number) => {
    if (isRatingOpen && hoverRating >= star) {
      return "text-sky-400 stroke-sky-400";
    }
    if (userRating >= star) {
      return "text-sky-400 fill-sky-400";
    }
    return "text-sky-400 stroke-sky-400 fill-none";
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    window.location.href = `/details/${resolvedMediaType}/${id}`;
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="relative flex flex-col gap-2 w-[280px] min-h-[480px] cursor-pointer mx-auto"
      >
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-800">
          <img
            src={imageSrc}
            alt={title ?? name ?? "Movie poster"}
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/logo.svg";
            }}
          />
          <button
            onClick={handleBookmark}
            className="absolute top-2 left-2 p-1.5 rounded-full hover:bg-black/20 transition-colors"
          >
            {isBookmarked ? (
              <BookmarkSolidIcon className="w-6 h-6 text-[#FFD700]" />
            ) : (
              <BookmarkIcon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        <div className="flex flex-col justify-between flex-grow">
          <div className="flex items-center justify-between min-h-[24px]">
            <div className="flex items-center gap-2">
              {vote_average && (
                <>
                  <StarIcon className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                  <span className="font-medium text-white">
                    {vote_average.toFixed(1)}
                  </span>
                </>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsRatingOpen(!isRatingOpen);
                }}
                className="relative ml-1 group"
              >
                <StarIcon
                  className={`w-5 h-5 ${
                    userRating > 0
                      ? "text-sky-400 fill-sky-400"
                      : "text-sky-400 stroke-sky-400 fill-none"
                  }`}
                  strokeWidth={2}
                />
              </button>
            </div>

            {(release_date || first_air_date) && (
              <span className="text-gray-400">
                {formatDate(release_date ?? first_air_date)}
              </span>
            )}
          </div>

          <a
            href={`/details/${resolvedMediaType}/${id}`}
            className="block"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/details/${resolvedMediaType}/${id}`;
            }}
          >
            <h3 className="text-lg font-medium text-white transition-colors hover:text-blue-400 min-h-[56px] line-clamp-2">
              {title ?? name}
            </h3>
          </a>

          <button
            onClick={handleBookmark}
            className="flex items-center justify-center w-full h-10 gap-2 text-blue-400 transition-colors rounded-md bg-white/10 hover:bg-white/20"
          >
            {isWatchlistPage ? (
              <>
                <XMarkIcon className="w-4 h-4" />
                Remove from Watchlist
              </>
            ) : isBookmarked ? (
              <>
                <CheckIcon className="w-4 h-4" />
                Added to Watchlist
              </>
            ) : (
              <>
                <PlusIcon className="w-4 h-4" />
                Add to Watchlist
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isRatingOpen && (
          <Portal>
            <div className="fixed inset-0 z-[9999] overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsRatingOpen(false)}
              />

              <motion.div
                initial={{ y: "100vh" }}
                animate={{ y: 0 }}
                exit={{ y: "100vh" }}
                transition={{
                  type: "spring",
                  damping: 30,
                  stiffness: 300,
                }}
                className="absolute inset-x-0 bottom-0 z-50 p-6 bg-gray-900 border-t border-gray-800 rounded-t-2xl"
              >
                <div className="max-w-lg mx-auto">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-1 bg-gray-700 rounded-full"></div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-medium text-white">
                      Rate this {resolvedMediaType}
                    </h3>
                    <button
                      onClick={() => setIsRatingOpen(false)}
                      className="p-2 text-gray-400 rounded-full hover:text-white hover:bg-gray-800"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex justify-center gap-3 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRating(star);
                        }}
                        className="p-2 transition-transform hover:scale-110"
                      >
                        <StarIcon
                          className={`w-10 h-10 ${getStarColor(
                            star
                          )} transition-colors`}
                          strokeWidth={2}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="mb-6 text-center text-gray-400">
                    {hoverRating > 0
                      ? ["Terrible", "Poor", "Average", "Good", "Excellent"][
                          hoverRating - 1
                        ]
                      : userRating > 0
                      ? "Update your rating"
                      : "Rate this content"}
                  </div>

                  {userRating > 0 && (
                    <div className="text-center">
                      <button
                        onClick={handleRemoveRating}
                        className="px-4 py-2 text-red-400 transition-colors rounded-md hover:bg-red-400/10"
                      >
                        Remove rating
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </Portal>
        )}
      </AnimatePresence>
    </>
  );
}
