import React, { useEffect } from "react";
import { motion, useAnimate } from "motion/react";
import TrailerButton from "./TrailerButton";
import { PlayIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

interface HeaderProps {
  readonly data: any;
  readonly children?: React.ReactNode;
  readonly onWatchTrailer?: () => void;
  readonly trailer?: any;
}

export default function Header({
  data,
  children,
  onWatchTrailer,
  trailer,
}: HeaderProps) {
  const [scope, animate] = useAnimate();

  if (!data) return null;

  const getYear = () => {
    const date = data.release_date || data.first_air_date;
    return date ? new Date(date).getFullYear() : null;
  };

  // Get media type (movie or tv)
  const mediaType = data.media_type || (data.title ? "movie" : "tv");

  // Use a consistent easing curve for all animations
  const easing = [0.22, 1, 0.36, 1];

  useEffect(() => {
    const sequence = async () => {
      // Start backdrop and overlay animations immediately
      await Promise.all([
        animate(
          "img",
          { scale: 1, opacity: 1 },
          { duration: 0.7, ease: easing }
        ),
        animate(".overlay", { opacity: 1 }, { duration: 0.5, ease: easing }),
      ]);

      // Then animate content in a coordinated sequence
      await animate(
        ".content > *",
        { y: 0, opacity: 1 },
        {
          duration: 0.5,
          delay: stagger(0.1),
          ease: easing,
        }
      );
    };

    sequence();
  }, [animate, data.id]);

  return (
    <div ref={scope} className="relative h-[80vh] bg-black">
      {/* Backdrop Image with Motion */}
      <motion.img
        initial={{ scale: 1.05, opacity: 0 }}
        src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
        alt={data.title ?? data.name}
        className="absolute inset-0 object-cover w-full h-full will-change-transform"
      />

      {/* Gradient Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        className="overlay absolute inset-0 bg-gradient-to-t from-[#0A1625] via-[#0A1625]/50 to-transparent"
      />

      {/* Content */}
      <motion.div className="absolute bottom-0 w-full p-8">
        <div className="container mx-auto content">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl font-heading"
          >
            {data.title ?? data.name}
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            className="max-w-2xl mb-6 text-lg text-gray-300"
          >
            {data.overview}
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            className="flex flex-wrap items-center gap-4 mb-6"
          >
            {/* Watch Now button */}
            <Link
              to={`/details/${mediaType}/${data.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 text-white transition-colors bg-red-600 rounded-full hover:bg-red-700"
            >
              <PlayIcon className="w-5 h-5" />
              <span>Watch Now</span>
            </Link>

            {/* Watch Trailer button */}
            {trailer && (
              <TrailerButton trailer={trailer} onClick={onWatchTrailer} />
            )}
            {!trailer && onWatchTrailer && (
              <button
                onClick={onWatchTrailer}
                className="inline-flex items-center gap-2 px-6 py-3 text-white transition-colors border border-white rounded-full hover:bg-white/10"
              >
                <PlayIcon className="w-5 h-5" />
                <span>Watch Trailer</span>
              </button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">
                {data.vote_average?.toFixed(1)}
              </span>
              <span className="text-gray-400">/ 10</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">{getYear()}</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Helper function to create staggered animations
const stagger = (delay: number) => (i: number) => i * delay;
