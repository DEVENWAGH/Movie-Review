import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  FilmIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setQuery,
  clearSearch,
  searchMulti,
} from "../store/slices/searchSlice";
import RegionSelector from './RegionSelector';
import Logo from './Logo';

export default function TopNav() {
  const location = useLocation();
  const isDetailsPage = location.pathname.startsWith('/details/');
  const dispatch = useAppDispatch();
  const { query, results } = useAppSelector((state) => state.search);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        dispatch(searchMulti(query));
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, dispatch]);

  
  const getMediaTypeStyle = (mediaType: string) => {
    switch (mediaType) {
      case 'movie':
        return 'bg-blue-900 text-blue-200';
      case 'tv':
        return 'bg-green-900 text-green-200';
      default:
        return 'bg-purple-900 text-purple-200';
    }
  };

  const handleSearchScroll = (e: React.WheelEvent) => {
    const element = e.currentTarget;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    // If we're at the top or bottom of the search results, don't prevent default
    if (
      (scrollTop === 0 && e.deltaY < 0) || 
      (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0)
    ) {
      return;
    }

    // Otherwise prevent default to stop main page scroll
    e.stopPropagation();
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 3, // Increased from 2 to 4 seconds
        ease: [0.16, 1, 0.3, 1],
      }}
      className="nav-container bg-[#0A1625] border-b border-gray-800 backdrop-blur-sm bg-opacity-90"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center flex-1 gap-8">
            {/* Logo with animation */}
            <AnimatePresence mode="wait">
              {isDetailsPage && (
                <motion.div 
                  key="logo"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                  className="sidebar-logo"
                >
                  <Logo />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Search Bar Container */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 1.2, 
                delay: 0.8,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="relative flex-1 max-w-3xl search-container"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => dispatch(setQuery(e.target.value))}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-700 rounded-md leading-5 bg-black text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-[#1A2737] focus:border-gray-600 focus:ring-gray-600 focus:ring-1 sm:text-sm"
                  placeholder="Search movies, TV shows..."
                />
                {query && (
                  <button
                    onClick={() => dispatch(clearSearch())}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-white" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {query && results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }} // Increased from 0.3
                    className="absolute w-full mt-2 bg-[#1A2737] rounded-md shadow-lg z-50 border border-gray-700 max-h-[60vh] overflow-y-auto custom-scrollbar"
                    onWheel={handleSearchScroll}
                  >
                    {results.map((s) => (
                      <Link
                        key={s.id}
                        to={`/details/${s.media_type}/${s.id}`} // Updated link path
                        className="flex items-center px-4 py-3 transition-colors hover:bg-gray-700"
                        onClick={() => dispatch(clearSearch())} // Clear search on click
                      >
                        {/* Poster/Profile Image */}
                        {s.poster_path ?? s.profile_path ? (
                          <div
                            className={`relative overflow-hidden rounded ${
                              s.media_type === "person" ? "w-12 h-12" : "w-12 h-16"
                            }`}
                          >
                            <img
                              src={`https://image.tmdb.org/t/p/w92${
                                s.poster_path ?? s.profile_path
                              }`}
                              alt={s.title ?? s.name}
                              className="absolute inset-0 object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div
                            className={`bg-gray-700 rounded flex items-center justify-center ${
                              s.media_type === "person" ? "w-12 h-12" : "w-12 h-16"
                            }`}
                          >
                            <FilmIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}

                        {/* Title and Media Type */}
                        <div className="flex-1 ml-3">
                          <p className="text-sm font-medium text-white">
                            {s.title ?? s.name}
                          </p>
                          <div className="flex items-center mt-1 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs ${getMediaTypeStyle(s.media_type)}`}>
                              {s.media_type?.toUpperCase()}
                            </span>
                          </div>
                          {s.overview && s.media_type !== "person" && (
                            <p className="text-xs text-gray-400 line-clamp-2">
                              {s.overview}
                            </p>
                          )}
                          {s.media_type === "person" && s.known_for_department && (
                            <p className="text-xs text-gray-400">
                              {s.known_for_department}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right side navigation with staggered animations */}
          <div className="flex items-center space-x-4">
            {[
              <motion.div
                key="region"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 1,
                  delay: 1,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <RegionSelector />
              </motion.div>,
              <motion.div
                key="watchlist"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 1,
                  delay: 1.2,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <Link 
                  to="/watchlist" 
                  className="flex items-center justify-center w-10 h-10 transition-colors rounded-full text-gray-400 hover:text-white hover:bg-[#1A2737]"
                >
                  <BookmarkIcon className="w-5 h-5" />
                </Link>
              </motion.div>,
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 1,
                  delay: 3.8,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <Link to="/profile" className="flex items-center nav-items">
                  <div className="flex items-center justify-center w-8 h-8 text-sm font-medium text-white bg-gray-700 rounded-full">
                    U
                  </div>
                </Link>
              </motion.div>
            ]}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
