import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Card from './Card';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setMediaType, fetchTrending, type MediaType } from '../store/slices/trendingSlice';

interface SliderProps {
  title: string;
  items: any[];
}

export default function Slider({ title, items }: Readonly<SliderProps>) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useAppDispatch();
  const mediaType = useAppSelector(state => state.trending.mediaType);

  useEffect(() => {
    const checkScroll = () => {
      if (sliderRef.current) {
        const { scrollWidth, clientWidth } = sliderRef.current;
        setShowControls(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { current } = sliderRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth;
      current.scrollTo({
        left: current.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (sliderRef.current) {
      const x = e.pageX - (sliderRef.current.offsetLeft || 0);
      const walk = (x - startX) * 2;
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'movie', label: 'Movies' },
    { value: 'tv', label: 'TV Shows' }
  ];

  const handleCategoryChange = (type: MediaType) => {
    dispatch(setMediaType(type));
    dispatch(fetchTrending(type));
    setShowDropdown(false);
  };

  return (
    <div className="py-10 overflow-visible">
      <div className="flex items-center justify-between mb-4">
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
        {showControls && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>
      
      <div className="relative mx-0 overflow-visible">
        <div
          ref={sliderRef}
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
          }}
          className={`
            flex gap-3 scroll-smooth overflow-x-auto overflow-y-visible py-8
            ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
            snap-x snap-mandatory
          `}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {Array.isArray(items) && items.map((item) => (
            <div key={item.id} className="snap-start shrink-0 first:ml-4">
              <Card {...item} isTrending={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
