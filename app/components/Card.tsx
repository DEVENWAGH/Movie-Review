import { Link } from "react-router";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon, StarIcon } from "@heroicons/react/24/solid";
import { useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToWatchlist, rateMedia } from '../store/slices/userActionsSlice';

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
  mediaType?: string; // Add this prop
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
  mediaType, // Add this prop
  isBookmarked: defaultIsBookmarked,
}: Readonly<CardProps>) {
  const dispatch = useAppDispatch();
  const isBookmarked = useAppSelector(state => state.userActions.watchlist.has(id)) || defaultIsBookmarked;
  const userRating = useAppSelector(state => state.userActions.ratings.get(id)) || 0;
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Determine the correct media type
  const resolvedMediaType = mediaType ?? media_type ?? (title ? 'movie' : 'tv');

  const formatDate = (date?: string) => {
    if (!date) return "";
    return showFullDate 
      ? new Date(date).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      : new Date(date).getFullYear();
  };

  const handleBookmark = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();  // Add this to prevent link navigation
    try {
      await dispatch(addToWatchlist({
        mediaId: id,
        mediaType: resolvedMediaType,
        watchlist: !isBookmarked
      })).unwrap();
    } catch (error) {
      console.error('Failed to bookmark:', error);
    }
  }, [dispatch, id, isBookmarked, resolvedMediaType]);

  const handleRating = async (rating: number) => {
    try {
      await dispatch(rateMedia({
        mediaId: id,
        mediaType: resolvedMediaType,
        rating: rating * 2 // Convert 5-star to 10-point scale
      })).unwrap();
      setUserRating(rating);
      setIsRatingOpen(false);
    } catch (error) {
      console.error('Failed to rate:', error);
    }
  };

  const getStarColor = (star: number) => {
    if (isRatingOpen && hoverRating >= star) {
      return 'text-[#FFD700]';
    }
    if (userRating >= star) {
      return 'text-[#FFD700]';
    }
    return 'text-gray-400';
  };

  return (
    <Link 
      to={`/details/${resolvedMediaType}/${id}`} 
      className={`block w-full relative ${isSlider ? 'pt-6 pb-8 px-3' : 'p-4'}`}
    >
      <div className="relative group">
        <div className="absolute inset-0 z-10">
          {/* Bookmark button */}
          <button
            onClick={handleBookmark}
            className="absolute top-2 left-2 p-1.5 bg-gray-900/80 rounded-md transition-colors backdrop-blur-sm"
          >
            {isBookmarked ? (
              <BookmarkSolidIcon className="w-5 h-5 text-[#FFD700]" />
            ) : (
              <BookmarkIcon className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Rating button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsRatingOpen(!isRatingOpen);
            }}
            className="absolute top-2 right-2 p-1.5 bg-gray-900/80 rounded-full transition-colors"
          >
            <StarIcon 
              className={`w-5 h-5 ${userRating > 0 ? 'text-[#FFD700]' : 'text-white'}`} 
            />
          </button>

          {/* Rating popup */}
          {isRatingOpen && (
            <div className="absolute z-20 p-3 rounded-lg top-12 right-2 bg-gray-900/95 backdrop-blur-sm">
              <div className="flex gap-1">
                {[1,2,3,4,5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRating(star);
                    }}
                    className="p-1"
                  >
                    <StarIcon 
                      className={`w-6 h-6 ${getStarColor(star)}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative transition-transform duration-300 group hover:scale-105">
          <div className={`relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-gray-800 ${
            isSlider ? 'max-w-[200px] shadow-lg' : ''
          }`}>
            <img
              src={`https://image.tmdb.org/t/p/w300${poster_path}`}
              alt={title ?? name}
              className="object-cover w-full h-full"
            />
            {vote_average && (
              <div className="absolute px-2 py-1 rounded-full bottom-2 right-2 bg-gray-900/80">
                <span className="text-sm font-medium text-white">
                  {vote_average.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          <div className={`mt-4 ${isSlider ? 'max-w-[200px]' : ''}`}>
            <h3 className="text-sm font-medium text-white truncate font-heading">
              {title ?? name}
            </h3>
            <div className="flex items-center gap-2 mt-1 font-sans text-xs text-gray-400">
              <span className="capitalize">{media_type}</span>
              <span>•</span>
              <span>{formatDate(release_date ?? first_air_date)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
