import React from "react";

interface HeaderProps {
  data?: {
    backdrop_path?: string;
    title?: string;
    name?: string;
    overview?: string;
    media_type?: string;
    release_date?: string;
    first_air_date?: string;
  };
}

function Header({ data }: Readonly<HeaderProps>) {
  const getYear = (date?: string) => {
    if (!date) return "";
    return new Date(date).getFullYear();
  };

  return (
    <div className="relative w-full h-[50vh] bg-gray-900 group">
      {data && (
        <>
          <img
            src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
            alt={data.title || data.name}
            className="object-cover w-full h-full"
          />
          {/* Gradient overlay with hover effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent transition-opacity duration-300 group-hover:opacity-30" />
          
          {/* Content with hover effect */}
          <div className="absolute bottom-0 left-0 p-8 w-full transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex items-center gap-3 mb-3">
              {data.media_type && (
                <span className={`
                  px-2 py-1 rounded text-sm font-medium
                  ${data.media_type === 'movie' ? 'bg-blue-900 text-blue-200' : 
                    data.media_type === 'tv' ? 'bg-green-900 text-green-200' :
                    'bg-purple-900 text-purple-200'}
                `}>
                  {data.media_type.toUpperCase()}
                </span>
              )}
              {(data.release_date || data.first_air_date) && (
                <span className="text-gray-300 text-lg">
                  {getYear(data.release_date || data.first_air_date)}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              {data.title || data.name}
            </h1>
            {data.overview && (
              <p className="text-lg text-white max-w-3xl line-clamp-2 drop-shadow-lg">
                {data.overview}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Header;
