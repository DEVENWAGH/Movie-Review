import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Mousewheel, Keyboard } from 'swiper/modules';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Card from './Card';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setMediaType, fetchTrending, type MediaType } from '../store/slices/trendingSlice';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/mousewheel';
import 'swiper/css/free-mode';

interface SliderProps {
  title: string;
  items: any[];
  containerStyle?: string;
}

export default function Slider({ title, items, containerStyle = "bg-black" }: Readonly<SliderProps>) {
  const dispatch = useAppDispatch();
  const mediaType = useAppSelector(state => state.trending.mediaType);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const swiperRef = useRef<any>(null);

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'movie', label: 'Movies' },
    { value: 'tv', label: 'TV Shows' }
  ];

  const handleCategoryChange = (type: MediaType) => {
    dispatch(setMediaType(type));
    dispatch(fetchTrending({ mediaType: type, timeWindow: 'day' }));
    setShowDropdown(false);
  };

  return (
    <div className={`py-10 group ${containerStyle}`} onWheel={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between px-6 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-1 text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700"
            >
              {categories.find(cat => cat.value === mediaType)?.label}
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute z-30 w-32 mt-1 bg-gray-800 rounded-md shadow-lg top-full">
                {categories.map(category => (
                  <button
                    key={category.value}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 text-gray-300
                      ${mediaType === category.value ? 'bg-gray-700' : ''}`}
                    onClick={() => handleCategoryChange(category.value as MediaType)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-gray-800/80 hover:bg-gray-700 group-hover:opacity-100"
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-gray-800/80 hover:bg-gray-700 group-hover:opacity-100"
          >
            <ChevronRightIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
      
      <div className="relative px-6">
        <Swiper
          modules={[Navigation, FreeMode, Mousewheel, Keyboard]}
          navigation
          freeMode={{
            enabled: true,
            sticky: false,
            momentumRatio: 0.5,
            minimumVelocity: 0.02
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
          spaceBetween={32}
          slidesPerView="auto"
          preventInteractionOnTransition={true}
          className="!overflow-visible slider-container"
          wrapperClass="!items-stretch"
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {Array.isArray(items) && items.map((item) => (
            <SwiperSlide key={item.id} className="!w-auto">
              <Card {...item} isSlider={true} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
