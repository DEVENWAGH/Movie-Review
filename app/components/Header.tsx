import React from "react";

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
    <div className="relative h-[80vh] group">
      {/* Background and overlay */}
      <div className="absolute inset-0 overflow-hidden cursor-pointer">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${data.backdrop_path})`,
          }}
        />
        {/* Base gradient - always present for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1625] via-[#0A1625]/40 to-transparent" />
        
        {/* Left edge gradient - always visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1625] via-transparent to-transparent" />
        
        {/* Bottom-left corner emphasis - maintains shadow on hover */}
        <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-radial from-[#0A1625] to-transparent opacity-90" />
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 transition-opacity duration-500 bg-black/40 group-hover:opacity-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full px-6 pb-24 mx-auto max-w-7xl">
        <h1 className="max-w-2xl mb-4 text-4xl font-bold text-white transition-transform duration-700 md:text-5xl lg:text-6xl group-hover:translate-x-4">
          {data.title || data.name}
        </h1>
        <p className="max-w-xl mb-2 text-lg text-gray-300 transition-transform duration-700 delay-100 group-hover:translate-x-4">
          {data.overview}
        </p>
        {getYear() && (
          <span className="px-3 py-1 mb-8 text-base font-medium text-gray-300 transition-transform duration-700 rounded-md bg-gray-800/80 md:text-lg group-hover:translate-x-4 w-fit">
            {getYear()}
          </span>
        )}
        <div className="relative z-20 flex gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}
