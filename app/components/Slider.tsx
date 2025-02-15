import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Mousewheel, Keyboard } from 'swiper/modules';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { motion, useScroll, useTransform, useSpring } from "motion/react";
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
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Create smooth animation values
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0, 1]),
    { 
      stiffness: 100,
      damping: 30,
      restDelta: 0.001 
    }
  );
  
  const y = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [30, 0]),
    { 
      stiffness: 100,
      damping: 30,
      restDelta: 0.001
    }
  );

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

  useEffect(() => {
    // Fix deprecated onChange warning
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (value > 0.5 && !hasAnimated) {
        setHasAnimated(true);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, hasAnimated]);

  return (
    <motion.div 
      ref={containerRef}
      style={{ opacity, y }}
      className={`py-10 group ${containerStyle} rounded-2xl relative`}
      onWheel={(e) => e.stopPropagation()}
    >
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.3,
          ease: [0.25, 0.1, 0, 1.0]
        }}
        className="flex items-center justify-between px-6 mb-6"
      >
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
      </motion.div>
      
      <div className="relative px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-2xl"
        >
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
            {Array.isArray(items) && items.map((item, index) => (
              <SwiperSlide key={`${title}-${item.id}-${index}`} className="!w-auto">
                <Card {...item} isSlider={true} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </motion.div>
  );
}
