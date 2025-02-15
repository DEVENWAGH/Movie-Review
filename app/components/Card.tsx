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
  mediaType?: string; // Add this prop
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
  mediaType, // Add this prop
}: Readonly<CardProps>) {
  // Determine the correct media type
  const resolvedMediaType = mediaType ?? media_type ?? (title ? 'movie' : 'tv');

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
      to={`/details/${resolvedMediaType}/${id}`} 
      className={`block w-full relative ${isSlider ? 'pt-6 pb-8 px-3' : 'p-4'}`}
    >
      <div className="relative transition-transform duration-300 group hover:scale-105">
        <div className={`relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-gray-800 ${
          isSlider ? 'max-w-[200px] shadow-lg' : ''
        }`}>
          <img
            src={`https://image.tmdb.org/t/p/w300${poster_path}`}
            alt={title ?? name}
            className="object-cover w-full h-full"
          />
          {vote_average && (
            <div className="absolute z-20 px-2 py-1 rounded-full top-2 right-2 bg-gray-900/80">
              <span className="text-sm font-medium text-white">
                {vote_average.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <div className={`mt-4 ${isSlider ? 'max-w-[200px]' : ''}`}>
          <h3 className="text-sm font-medium text-white truncate font-heading">
            {title ?? name}
          </h3>
          <div className="flex items-center gap-2 mt-1 font-sans text-xs text-gray-400">
            <span className="capitalize">{media_type}</span>
            <span>•</span>
            <span>{formatDate(release_date ?? first_air_date)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
