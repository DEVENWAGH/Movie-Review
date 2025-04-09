import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDiscover, setSortBy, setCategory, resetState, type MediaType } from '../store/slices/discoverSlice';
import InfiniteGrid from './shared/InfiniteGrid';

interface DiscoverProps {
  mediaType: MediaType;
  title: string;
}

export default function Discover({ mediaType, title }: Readonly<DiscoverProps>) {
  const dispatch = useAppDispatch();
  const { items, loading, currentPage, totalPages, sortBy, category } = useAppSelector((state) => state.discover);

  const sortOptions = [
    { value: 'popularity.desc', label: 'Popularity' },
    { value: 'vote_average.desc', label: 'Top Rated' },
    { value: 'release_date.desc', label: 'Release Date' },
    { value: 'revenue.desc', label: 'Revenue' }
  ];

  const categoryOptions = {
    movie: [
      { value: 'discover', label: 'All Movies' },
      { value: 'now_playing', label: 'Now Playing' },
      { value: 'upcoming', label: 'Upcoming' },
    ],
    tv: [
      { value: 'discover', label: 'All Shows' },
      { value: 'on_the_air', label: 'On TV' },
      { value: 'airing_today', label: 'Airing Today' },
    ]
  };

  useEffect(() => {
    dispatch(resetState());
    dispatch(fetchDiscover({ mediaType, page: 1, sortBy, category }));
  }, [dispatch, mediaType, sortBy, category]);

  const fetchMoreData = () => {
    if (currentPage <= totalPages) {
      dispatch(fetchDiscover({ mediaType, page: currentPage, sortBy, category }));
    }
  };

  return (
    <main className="p-8">
      <div className="mb-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <div className="flex items-center gap-4">
            <select
              value={category}
              onChange={(e) => dispatch(setCategory(e.target.value))}
              className="bg-[#1A2737] text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              {categoryOptions[mediaType].map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {/* Only show sort options when category is 'discover' */}
            {category === 'discover' && (
              <select
                value={sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value))}
                className="bg-[#1A2737] text-white px-4 py-2 rounded-lg border border-gray-700"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      <InfiniteGrid
        items={items}
        loading={loading}
        hasMore={currentPage <= totalPages}
        onLoadMore={fetchMoreData}
        mediaType={mediaType}
        showFullDate={category === 'discover' && sortBy === 'release_date.desc'}
      />
    </main>
  );
}
