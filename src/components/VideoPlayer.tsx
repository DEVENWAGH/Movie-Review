import { XMarkIcon } from '@heroicons/react/24/outline';
import ReactPlayer from 'react-player/youtube';

interface VideoPlayerProps {
  videoKey: string;
  onClose: () => void;
}

export default function VideoPlayer({ videoKey, onClose }: Readonly<VideoPlayerProps>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
      <div className="absolute z-50 top-4 right-4">
        <button
          onClick={onClose}
          className="p-2 text-white transition-colors rounded-full bg-gray-800/50 hover:bg-gray-700/50"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      
      <div className="relative w-full max-w-5xl mx-4 aspect-video">
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${videoKey}`}
          width="100%"
          height="100%"
          playing
          controls
          config={{
            playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0
            }
          }}
        />
      </div>
    </div>
  );
}
