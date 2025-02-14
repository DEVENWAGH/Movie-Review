import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel, Keyboard } from 'swiper/modules';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Card from './Card';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setMediaType, fetchTrending, type MediaType } from '../store/slices/trendingSlice';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/mousewheel';

interface SliderProps {
  title: string;
  items: any[];
}

export default function Slider({ title, items }: Readonly<SliderProps>) {
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
    <div className="py-10 group overflow-hidden rounded-2xl bg-black">
      <div className="flex items-center justify-between mb-6 px-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300"
            >
              {categories.find(cat => cat.value === mediaType)?.label}
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute top-full mt-1 w-32 bg-gray-800 rounded-md shadow-lg z-30">
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
            className="w-10 h-10 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors flex items-center justify-center group-hover:opacity-100"
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="w-10 h-10 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors flex items-center justify-center group-hover:opacity-100"
          >
            <ChevronRightIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
      
      <div className="relative px-6">
        <Swiper
          modules={[Navigation, Mousewheel, Keyboard]}
          spaceBetween={32}
          slidesPerView="auto"
          mousewheel
          keyboard
          className="!overflow-visible"
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
