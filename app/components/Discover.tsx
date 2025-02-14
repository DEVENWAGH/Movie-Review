import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDiscover, setSortBy, resetState, type MediaType } from '../store/slices/discoverSlice';
import InfiniteGrid from './shared/InfiniteGrid';

interface DiscoverProps {
  mediaType: MediaType;
  title: string;
}

export default function Discover({ mediaType, title }: Readonly<DiscoverProps>) {
  const dispatch = useAppDispatch();
  const { items, loading, currentPage, totalPages, sortBy } = useAppSelector((state) => state.discover);

  const sortOptions = [
    { value: 'popularity.desc', label: 'Popularity' },
    { value: 'vote_average.desc', label: 'Rating' },
    { value: 'release_date.desc', label: 'Release Date' },
    { value: 'revenue.desc', label: 'Revenue' }
  ];

  useEffect(() => {
    dispatch(resetState());
    dispatch(fetchDiscover({ mediaType, page: 1, sortBy }));
  }, [dispatch, mediaType, sortBy]);

  const fetchMoreData = () => {
    if (currentPage <= totalPages) {
      dispatch(fetchDiscover({ mediaType, page: currentPage, sortBy }));
    }
  };

  return (
    <main className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <select
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <InfiniteGrid
        items={items}
        loading={loading}
        hasMore={currentPage <= totalPages}
        onLoadMore={fetchMoreData}
        mediaType={mediaType}
        showFullDate={sortBy === 'release_date.desc'}
      />
    </main>
  );
}
