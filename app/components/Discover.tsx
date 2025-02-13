import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDiscover, setSortBy, resetState, type MediaType } from '../store/slices/discoverSlice';
import Card from './Card';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface DiscoverProps {
  mediaType: MediaType;
  title: string;
}

export default function Discover({ mediaType, title }: DiscoverProps) {
  const dispatch = useAppDispatch();
  const { items, loading, currentPage, totalPages, sortBy } = useAppSelector((state) => state.discover);

  const sortOptions = [
    { value: 'popularity.desc', label: 'Popularity' },
    { value: 'vote_average.desc', label: 'Rating' },
    { value: 'release_date.desc', label: 'Release Date' },
    { value: 'revenue.desc', label: 'Revenue' }
  ];

  useEffect(() => {
    dispatch(resetState()); // Reset state when mediaType changes
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

      {loading && currentPage === 1 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={items.length}
          next={fetchMoreData}
          hasMore={currentPage <= totalPages}
          loader={
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          }
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          {items?.map(item => (
            <Card key={item.id} {...item} mediaType={mediaType} />
          ))}
        </InfiniteScroll>
      )}
    </main>
  );
}
