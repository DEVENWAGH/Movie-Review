import { Link } from "react-router";  // Updated import

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
  isTrending,
}: Readonly<CardProps>) {
  const getYear = (date?: string) => (date ? new Date(date).getFullYear() : "");

  const cardWidth = isTrending ? "w-70" : "w-50";
  const cardPadding = isTrending ? "pt-6 pb-12 px-4" : "pt-4 pb-10 px-3";

  return (
    <Link 
      to={`/details/${media_type}/${id}`} 
      className={`group block ${cardPadding}`}
    >
      <div className={`relative transition-all duration-300 group-hover:scale-105 group-hover:z-20 ${cardWidth}`}>
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/w300${poster_path}`}
            alt={title || name}
            className="object-cover w-full h-full"
          />
          {vote_average && (
            <div className="absolute top-2 right-2 bg-gray-900/80 rounded-full px-2 py-1">
              <span className="text-sm font-medium text-white">
                {vote_average.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <div className="mt-2">
          <h3 className="text-white font-medium truncate">{title || name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="capitalize">{media_type}</span>
            <span>•</span>
            <span>{getYear(release_date || first_air_date)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
