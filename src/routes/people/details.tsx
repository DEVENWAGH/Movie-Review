import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchPeopleDetails,
  resetState,
} from "../../store/slices/peopleDetailsSlice";
import {
  ArrowLeftIcon,
  GlobeAltIcon,
  FilmIcon,
  TvIcon,
} from "@heroicons/react/24/outline";
// Add social media icons
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
} from "../../components/SocialIcons";
import CastingMoviesSlider from "../../components/CastingMoviesSlider";
import Layout from "../../components/shared/Layout";
import axios from "../../utils/axios";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
const SOCIAL_LINKS = {
  facebook: "https://facebook.com",
  twitter: "https://x.com",
  instagram: "https://instagram.com",
  homepage: "",
};

const PeopleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { details, loading, error } = useAppSelector(
    (state) => state.peopleDetails
  );

  // Add state for manual credit fetching
  const [credits, setCredits] = useState<any>(null);
  const [creditsLoading, setCreditsLoading] = useState(false);

  // Main data fetch
  useEffect(() => {
    if (id) {
      dispatch(fetchPeopleDetails(id));
    }

    return () => {
      dispatch(resetState());
    };
  }, [id, dispatch]);

  // Additional fetch for combined credits if needed
  useEffect(() => {
    const fetchCredits = async () => {
      // Only fetch if we have details but no credits data
      if (
        details &&
        (!details.credits?.cast || details.credits.cast.length === 0)
      ) {
        try {
          setCreditsLoading(true);
          // Get combined credits (both movies and TV)
          const response = await axios.get(`person/${id}/combined_credits`, {
            params: { language: "en-US" },
          });

          if (response.data && response.data.cast) {
            // Sort by popularity for better results
            const sortedCredits = response.data.cast.sort(
              (a: any, b: any) => b.popularity - a.popularity
            );
            setCredits({ cast: sortedCredits });
          }
        } catch (error) {
          console.error("Failed to fetch combined credits:", error);
        } finally {
          setCreditsLoading(false);
        }
      }
    };

    fetchCredits();
  }, [details, id]);

  // Improved loading state with consistent styling
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
        </div>
      </Layout>
    );
  }

  // Enhanced error state with proper styling and navigation
  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <div className="w-16 h-16 mb-6 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Something went wrong
          </h2>
          <p className="mb-6 text-gray-400">
            We're having trouble loading this content. Please try again later.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 text-white transition-colors bg-red-600 rounded-full hover:bg-red-700"
          >
            Return to Home Page
          </button>
        </div>
      </Layout>
    );
  }

  if (!details) {
    return null;
  }

  const { name, biography, profile_path, homepage, external_ids } = details;
  const social_links = external_ids || {};

  // Use local credits state if available, otherwise use details.credits
  const creditsData = credits || details.credits;
  const hasCastCredits = creditsData?.cast && creditsData.cast.length > 0;

  // Filter movie and TV credits if we have combined credits
  const movieCredits =
    creditsData?.cast?.filter((item: any) => item.media_type === "movie") || [];
  const tvCredits =
    creditsData?.cast?.filter((item: any) => item.media_type === "tv") || [];

  return (
    <Layout>
      <div className="container px-4 mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 p-2 mb-6 text-gray-400 transition-colors rounded-full hover:bg-gray-800 hover:text-white"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-shrink-0 w-full md:w-72">
            {profile_path ? (
              <img
                src={`${IMAGE_BASE_URL}${profile_path}`}
                alt={name}
                className="object-cover w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="flex items-center justify-center w-full bg-gray-800 rounded-lg h-96">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}

            {/* Social Links with Icons */}
            <div className="flex flex-wrap gap-3 mt-4">
              {social_links.facebook_id && (
                <a
                  href={`${SOCIAL_LINKS.facebook}/${social_links.facebook_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-blue-400 transition-colors rounded-md bg-blue-900/20 hover:bg-blue-900/40"
                >
                  <FacebookIcon className="w-5 h-5" />
                  <span>Facebook</span>
                </a>
              )}
              {social_links.twitter_id && (
                <a
                  href={`${SOCIAL_LINKS.twitter}/${social_links.twitter_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-blue-400 transition-colors rounded-md bg-blue-900/20 hover:bg-blue-900/40"
                >
                  <TwitterIcon className="w-5 h-5" />
                  <span>Twitter</span>
                </a>
              )}
              {social_links.instagram_id && (
                <a
                  href={`${SOCIAL_LINKS.instagram}/${social_links.instagram_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-purple-400 transition-colors rounded-md bg-purple-900/20 hover:bg-purple-900/40"
                >
                  <InstagramIcon className="w-5 h-5" />
                  <span>Instagram</span>
                </a>
              )}
              {homepage && (
                <a
                  href={homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 transition-colors rounded-md bg-gray-900/40 hover:bg-gray-900/60"
                >
                  <GlobeAltIcon className="w-5 h-5" />
                  <span>Homepage</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="mb-6 text-3xl font-bold text-white">{name}</h1>
            {biography ? (
              <p className="mb-8 text-gray-300 whitespace-pre-line">
                {biography}
              </p>
            ) : (
              <p className="mb-8 italic text-gray-500">
                No biography available.
              </p>
            )}
          </div>
        </div>

        {/* Credits Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-white">Known For</h2>

          {/* Credits loading state */}
          {creditsLoading && (
            <div className="flex items-center justify-center py-10">
              <div className="w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
            </div>
          )}

          {/* Show credits when available */}
          {!creditsLoading && hasCastCredits && (
            <div className="space-y-12">
              {/* Movie Credits */}
              {movieCredits.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FilmIcon className="w-5 h-5 text-white" />
                    <h3 className="text-xl font-semibold text-white">Movies</h3>
                  </div>
                  <CastingMoviesSlider items={movieCredits} />
                </div>
              )}

              {/* TV Credits */}
              {tvCredits.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TvIcon className="w-5 h-5 text-white" />
                    <h3 className="text-xl font-semibold text-white">
                      TV Shows
                    </h3>
                  </div>
                  <CastingMoviesSlider items={tvCredits} />
                </div>
              )}

              {/* Show all credits if no type filtering */}
              {!movieCredits.length && !tvCredits.length && (
                <CastingMoviesSlider items={creditsData.cast} />
              )}
            </div>
          )}

          {/* No credits fallback */}
          {!creditsLoading && !hasCastCredits && (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-900/30 rounded-xl">
              <p className="text-gray-400">
                No movie or TV show credits found for this person.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PeopleDetails;
