import React, { useRef } from 'react';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Mousewheel, Keyboard } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

interface CastingMoviesSliderProps {
  items: Array<{
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    character?: string;
    media_type: string;
    release_date?: string;
    first_air_date?: string;
  }>;
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w300';
const PLACEHOLDER_IMAGE = '/logo.svg';

export default function CastingMoviesSlider({ items }: Readonly<CastingMoviesSliderProps>) {
  const swiperRef = useRef(null);

  return (
    <div className="casting-slider-container" onWheel={(e) => e.stopPropagation()}>
      <Swiper
        ref={swiperRef}
        modules={[Navigation, FreeMode, Mousewheel, Keyboard]}
        navigation
        freeMode={{
          enabled: true,
          sticky: false,
          momentum: true,
          momentumRatio: 0.8,
          momentumBounce: false
        }}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: true
        }}
        keyboard={{
          enabled: true,
          onlyInViewport: true
        }}
        touchEventsTarget="container"
        touchRatio={1.5}
        touchAngle={45}
        grabCursor={true}
        slidesPerView="auto"
        spaceBetween={16}
        preventInteractionOnTransition={false}
        resistance={false}
        className="casting-slider"
      >
        {items.map((item) => (
          <SwiperSlide key={`${item.id}-${item.character}`} className="!w-[200px] h-auto">
            <Link to={`/details/${item.media_type}/${item.id}`} className="block h-full">
              <div className="bg-[#1A2737] rounded-lg overflow-hidden h-full flex flex-col">
                <div className="aspect-[2/3] relative flex-shrink-0">
                  <img
                    src={item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : PLACEHOLDER_IMAGE}
                    alt={item.title || item.name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </div>
                <div className="flex flex-col flex-1 p-3">
                  <div className="flex-1 min-h-[64px]">
                    <h3 className="text-sm font-medium text-white truncate">
                      {item.title || item.name}
                    </h3>
                    <div className="h-[32px]">
                      {item.character && (
                        <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                          as {item.character}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full pt-2 border-t border-gray-700">
                    <p className="text-xs text-gray-500">
                      {(item.release_date || item.first_air_date)?.split('-')[0]}
                    </p>
                    <span className="px-2 py-1 text-xs text-gray-400 bg-gray-800 rounded-full">
                      {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
