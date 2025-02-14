import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  BellIcon,
  XMarkIcon,
  FilmIcon,
  BookmarkIcon,
  GlobeAltIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router"; // Updated import
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setQuery,
  clearSearch,
  searchMulti,
} from "../store/slices/searchSlice";
import { setLanguage } from "../store/slices/languageSlice";

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path?: string;
  profile_path?: string;
  overview?: string;
  known_for_department?: string;
}

export default function TopNav() {
  const dispatch = useAppDispatch();
  const { query, results, loading } = useAppSelector((state) => state.search);
  const { currentLanguage } = useAppSelector((state) => state.language);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    { code: "hi", label: "Hindi" },
  ];

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        dispatch(searchMulti(query));
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, dispatch]);

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Search Bar Container */}
          <div className="flex-1 max-w-2xl relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => dispatch(setQuery(e.target.value))}
                className="block w-full pl-10 pr-10 py-2 border border-gray-700 rounded-md leading-5 bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-gray-700 focus:border-gray-600 focus:ring-gray-600 focus:ring-1 sm:text-sm"
                placeholder="Search movies, TV shows..."
              />
              {query && (
                <button
                  onClick={() => dispatch(clearSearch())}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-white" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {query && results.length > 0 && (
              <div className="absolute w-full mt-2 bg-gray-800 rounded-md shadow-lg z-50 border border-gray-700 max-h-96 overflow-y-auto">
                {results.map((s) => (
                  <Link
                    key={s.id}
                    to="#"
                    className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors"
                  >
                    {/* Poster/Profile Image */}
                    {s.poster_path || s.profile_path ? (
                      <div
                        className={`relative overflow-hidden rounded ${
                          s.media_type === "person" ? "w-12 h-12" : "w-12 h-16"
                        }`}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w92${
                            s.poster_path || s.profile_path
                          }`}
                          alt={s.title || s.name}
                          className="absolute inset-0 w-full h-full object-cover"
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
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-white">
                        {s.title || s.name}
                      </p>
                      <div className="flex items-center mt-1 mb-1">
                        <span
                          className={`
                          px-2 py-0.5 rounded text-xs
                          ${
                            s.media_type === "movie"
                              ? "bg-blue-900 text-blue-200"
                              : s.media_type === "tv"
                              ? "bg-green-900 text-green-200"
                              : "bg-purple-900 text-purple-200"
                          }
                        `}
                        >
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
              </div>
            )}
          </div>

          {/* Right side navigation */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center space-x-1 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <GlobeAltIcon className="h-5 w-5" />
                <ChevronDownIcon className="h-4 w-4" />
              </button>

              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-50 border border-gray-700">
                  <div className="py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => {
                          dispatch(setLanguage(lang.code));
                          setShowLanguageMenu(false);
                        }}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Watchlist */}
            <Link
              to="/watchlist"
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <BookmarkIcon className="h-6 w-6" />
            </Link>

            {/* Notifications */}
            <button
              type="button"
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <BellIcon className="h-6 w-6" />
            </button>

            {/* User Avatar */}
            <Link to="/profile" className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-medium">
                U
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
