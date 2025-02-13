import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPopular, setMediaType, type MediaType } from '../store/slices/popularSlice';
import TopNav from '../components/TopNav';
import { Sidebar } from '../components/Sidebar';
import Card from '../components/Card';
// import InfiniteGrid from '../components/shared/InfiniteGrid';

export default function Popular() {
  const dispatch = useAppDispatch();
  const { items, mediaType, loading, currentPage, totalPages } = useAppSelector((state) => state.popular);
  
  const mediaTypes = [
    { value: 'movie' as MediaType, label: 'Movies' },
    { value: 'tv' as MediaType, label: 'TV Shows' }
  ];

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchPopular({ mediaType, page: 1 }));
    }
  }, [dispatch, mediaType]);

  const fetchMoreData = () => {
    if (currentPage <= totalPages) {
      dispatch(fetchPopular({ mediaType, page: currentPage }));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1">
        <TopNav />
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Popular</h1>
            <div className="flex gap-4">
              {mediaTypes.map(type => (
                <button
                  key={type.value}
                  className={`px-4 py-2 rounded-full transition-colors
                    ${mediaType === type.value 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  onClick={() => dispatch(setMediaType(type.value))}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* <InfiniteGrid
            items={items}
            loading={loading}
            hasMore={currentPage <= totalPages}
            onLoadMore={fetchMoreData}
            page={currentPage}
            mediaType={mediaType}
          /> */}
        </main>
      </div>
    </div>
  );
}
