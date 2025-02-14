import { Link } from "react-router";

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
}: Readonly<CardProps>) {
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

  return (
    <Link 
      to={`/details/${media_type}/${id}`} 
      className={`block w-full relative ${isSlider ? 'pt-4 pb-6 px-2' : 'p-4'}`}
    >
      <div className="relative group hover:scale-105 transition-transform duration-300">
        <div className={`relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-gray-800 ${isSlider ? 'max-w-[180px]' : ''}`}>
          <img
            src={`https://image.tmdb.org/t/p/w300${poster_path}`}
            alt={title || name}
            className="object-cover w-full h-full"
          />
          {vote_average && (
            <div className="absolute top-2 right-2 bg-gray-900/80 rounded-full px-2 py-1 z-20">
              <span className="text-sm font-medium text-white">
                {vote_average.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <div className={`mt-3 relative z-20 ${isSlider ? 'max-w-[180px]' : ''}`}>
          <h3 className="text-white font-medium truncate text-sm">
            {title || name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            <span className="capitalize">{media_type}</span>
            <span>•</span>
            <span>{formatDate(release_date || first_air_date)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
