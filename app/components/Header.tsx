import React from "react";
import { motion } from "motion/react";

interface HeaderProps {
  readonly data: any;
  readonly children?: React.ReactNode;
}

export default function Header({ data, children }: HeaderProps) {
  if (!data) return null;

  const getYear = () => {
    const date = data.release_date || data.first_air_date;
    return date ? new Date(date).getFullYear() : null;
  };

  return (
    <div className="relative h-[80vh] bg-black">
      {/* Backdrop Image with Motion - Removed overflow constraint */}
      <motion.div
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.5,
          ease: [0.25, 0.1, 0, 1.0] // Custom easing curve
        }}
        className="absolute inset-0"
      >
        <img
          src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
          alt={data.title ?? data.name}
          className="object-cover w-full h-full"
        />
      </motion.div>

      {/* Gradient Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="absolute inset-0 bg-gradient-to-t from-[#0A1625] via-[#0A1625]/50 to-transparent"
      />

      {/* Content */}
      <motion.div 
        className="absolute bottom-0 w-full p-8"
      >
        <div className="container mx-auto">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.4,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl font-heading"
          >
            {data.title ?? data.name}
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.4,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="max-w-2xl mb-6 text-lg text-gray-300"
          >
            {data.overview}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{data.vote_average?.toFixed(1)}</span>
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
