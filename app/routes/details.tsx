import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchDetails, resetDetails } from "../store/slices/detailsSlice";
import TopNav from "../components/TopNav";
import Slider from "../components/Slider";
import WatchProviders from "../components/WatchProviders";
import TranslationsList from "../components/TranslationsList";
import TrailerButton from "../components/TrailerButton";
import SimpleSlider from "../components/SimpleSlider";
import VideoPlayer from '../components/VideoPlayer';
import { PlayIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Details() {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { region } = useAppSelector((state) => state.region);
  const {
    details,
    credits,
    similar,
    videos,
    providers,
    translations,
    loading,
    recommendations,
  } = useAppSelector((state) => state.details);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    if (!mediaType || !id) {
      navigate("/"); // Redirect to home if params are missing
      return;
    }

    dispatch(fetchDetails({ mediaType, id }));
    return () => {
      dispatch(resetDetails());
    };
  }, [dispatch, mediaType, id, navigate, region]); // Add region as dependency

  const getLogoClass = (logoPath: string) => {
    // Check if logo is already on dark background or has transparency
    if (logoPath.includes("dark") || logoPath.includes("-negative")) {
      return "brightness-100"; // Keep original colors
    }
    // For light logos that need dark background
    return "brightness-100 bg-gray-800/50 p-2 rounded";
  };

  const categorizedVideos = useMemo(() => {
    if (!videos) return {};
    return videos.reduce((acc: { [key: string]: any[] }, video: any) => {
      if (!acc[video.type]) acc[video.type] = [];
      acc[video.type].push(video);
      return acc;
    }, {});
  }, [videos]);

  const mainTrailer = useMemo(() => {
    if (!videos?.length) return null;
    
    // First try to find an official trailer
    let trailer = videos.find(video => 
      video.type === "Trailer" && 
      video.site === "YouTube" &&
      video.official
    );

    // If no official trailer, try any trailer
    if (!trailer) {
      trailer = videos.find(video => 
        video.type === "Trailer" && 
        video.site === "YouTube"
      );
    }

    console.log('Selected Trailer:', {
      name: trailer?.name,
      language: trailer?.iso_639_1,
      isOfficial: trailer?.official
    });

    return trailer;
  }, [videos]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1625]">
        <TopNav />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="w-12 h-12 border-b-2 border-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Show error state if no details
  if (!details) {
    return (
      <div className="min-h-screen bg-[#0A1625]">
        <TopNav />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="text-center text-white">
            <h1 className="mb-2 text-2xl font-bold">Content Not Found</h1>
            <p className="text-gray-400">
              The requested content could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const backdropUrl = `https://image.tmdb.org/t/p/original${details.backdrop_path}`;
  const posterUrl = `https://image.tmdb.org/t/p/w500${details.poster_path}`;

  return (
    <div className="min-h-screen bg-[#0A1625]">
      <TopNav />

      {selectedVideo && (
        <VideoPlayer
          videoKey={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Hero Section */}
      <div className="relative">
        <div className="relative h-[80vh]">
          {/* Banner Image Section */}
          <div
            className="relative h-[80vh] bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${backdropUrl})`,
              backgroundPosition: "center 20%",
            }}
          >
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1625] via-[#0A1625]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1625] via-[#0A1625]/30 to-transparent" />

            {/* Content Layout - Moved to top */}
            <div className="container relative z-10 h-full px-4 pt-24 mx-auto">
              <div className="flex gap-8">
                {/* Poster */}
                <div className="flex-shrink-0 hidden transition-transform duration-300 transform md:block w-72 hover:scale-105">
                  <img
                    src={posterUrl}
                    alt={details.title || details.name}
                    className="w-full shadow-2xl rounded-xl"
                  />
                </div>

                {/* Details Column */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold text-white">
                      {details.title || details.name}
                    </h1>

                    {/* Production Studios */}
                    {details.production_companies?.length > 0 && (
                      <div className="flex items-center gap-6">
                        {details.production_companies.map(
                          (company: any) =>
                            company.logo_path && (
                              <div
                                key={company.id}
                                className="relative group"
                              >
                                <img
                                  src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                  alt={company.name}
                                  className={`h-10 object-contain transition-transform duration-300 group-hover:scale-110 ${getLogoClass(
                                    company.logo_path
                                  )}`}
                                />
                                <div className="absolute transition-opacity -translate-x-1/2 opacity-0 -bottom-6 left-1/2 group-hover:opacity-100 whitespace-nowrap">
                                  <span className="text-xs text-gray-400">
                                    {company.name}
                                  </span>
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    )}
                  </div>

                  {/* Metadata and Genres */}
                  <div className="flex items-center gap-4 mb-6 text-sm text-gray-300">
                    {details.release_date && (
                      <span>
                        {new Date(details.release_date).getFullYear()}
                      </span>
                    )}
                    {details.runtime && (
                      <span>
                        {Math.floor(details.runtime / 60)}h{" "}
                        {details.runtime % 60}m
                      </span>
                    )}
                    {details.vote_average && (
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        {details.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* Genres */}
                  <div className="flex gap-2 mb-6">
                    {details.genres?.map((genre: any) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 text-sm text-gray-300 bg-gray-800 rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  {/* Overview and Trailer Button */}
                  <div className="mt-6 space-y-6">
                    <p className="max-w-3xl text-lg leading-relaxed text-gray-300">
                      {details.overview}
                    </p>

                    {mainTrailer && (
                      <TrailerButton 
                        trailer={mainTrailer} 
                        onClick={() => setSelectedVideo(mainTrailer.key)} 
                      />
                    )}
                  </div>

                  {/* Watch Providers */}
                  {providers && Object.keys(providers).length > 0 && (
                    <div className="mt-8">
                      <WatchProviders providers={providers} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Content Section - Below Banner */}
          <div className="bg-[#0A1625]">
            <div className="container px-4 mx-auto">
              {/* Translations and Recommendations Row */}
              <div className="grid grid-cols-1 gap-8 py-12">
                {/* Translations */}
                {translations?.length > 0 && (
                  <div>
                    <TranslationsList translations={translations} />
                  </div>
                )}

                {/* Recommendations */}
                {recommendations?.length > 0 && (
                  <div>
                    <h3 className="mb-6 text-xl font-bold text-white">
                      More Like This
                    </h3>
                    <SimpleSlider items={recommendations.slice(0, 10)} />
                  </div>
                )}
              </div>

              {/* Rest of content sections */}
              {/* Cast Section */}
              {credits?.cast?.length > 0 && (
                <section>
                  <h2 className="mb-6 text-2xl font-bold text-white">Cast</h2>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                    {credits.cast.slice(0, 6).map((person: any) => (
                      <div key={person.id} className="text-center">
                        <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2">
                          {person.profile_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                              alt={person.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gray-800">
                              <span className="text-gray-500">No Image</span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-sm font-medium text-white">
                          {person.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {person.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Videos Section */}
              {Object.keys(categorizedVideos).length > 0 && (
                <section className="py-20 border-b border-gray-800">
                  <div className="container px-4 mx-auto">
                    {Object.entries(categorizedVideos).map(([type, typeVideos]) => (
                      <div key={type} className="mb-12 last:mb-0">
                        <h2 className="mb-6 text-2xl font-bold text-white font-outfit">
                          {type}s
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                          {typeVideos.map((video: any) => (
                            <div key={video.id} className="cursor-pointer group" onClick={() => setSelectedVideo(video.key)}>
                              <div className="relative overflow-hidden bg-gray-800 rounded-xl aspect-video">
                                <img
                                  src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                                  alt={video.name}
                                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/50 group-hover:opacity-100">
                                  <PlayIcon className="w-16 h-16 text-white" />
                                </div>
                              </div>
                              <h3 className="mt-3 text-sm font-medium text-gray-300">{video.name}</h3>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Similar Titles with updated styling */}
              {similar?.length > 0 && (
                <section className="py-20">
                  <div className="container px-4 mx-auto">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-white font-outfit">
                        Similar to {details.title || details.name}
                      </h2>
                      <p className="mt-2 text-base text-gray-400">
                        Because you watched {details.title || details.name}
                      </p>
                    </div>
                    <div className="px-4">
                      <Slider
                        title=""
                        items={similar}
                        containerStyle="bg-transparent hover:bg-black/30 transition-colors duration-500"
                      />
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
