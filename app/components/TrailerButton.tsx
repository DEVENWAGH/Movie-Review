import { PlayIcon } from '@heroicons/react/24/solid';

interface TrailerButtonProps {
  trailer?: any;
  onClick: () => void;
}

export default function TrailerButton({ trailer, onClick }: Readonly<TrailerButtonProps>) {
  if (!trailer) return null;

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-6 py-3 text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors"
    >
      <PlayIcon className="w-5 h-5" />
      <span>Play Trailer</span>
    </button>
  );
}
