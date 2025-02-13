import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTrending, setMediaType, type MediaType } from '../store/slices/trendingSlice';
import TopNav from '../components/TopNav';
import { Sidebar } from '../components/Sidebar';
import Card from '../components/Card';
import InfiniteScroll from 'react-infinite-scroll-component';
// import InfiniteGrid from '../components/shared/InfiniteGrid';

export default function Trending() {
  const dispatch = useAppDispatch();
  const { items, mediaType, timeWindow, loading, error } = useAppSelector((state) => state.trending);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const mediaTypes = [
    { value: 'all' as MediaType, label: 'All' },
    { value: 'movie' as MediaType, label: 'Movies' },
    { value: 'tv' as MediaType, label: 'TV Shows' }
  ];

  const fetchMoreData = () => {
    if (items.length >= 500) {
      setHasMore(false);
      return;
    }

    setPage(page + 1);
    dispatch(fetchTrending({ mediaType, timeWindow, page: page + 1 }));
  };

  useEffect(() => {
    dispatch(fetchTrending({ mediaType, timeWindow, page: 1 }));
  }, [dispatch, mediaType, timeWindow]);

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1">
        <TopNav />
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Trending</h1>
            <div className="flex gap-4">
              {mediaTypes.map(type => (
                <button
                  key={type.value}
                  className={`px-4 py-2 rounded-full transition-colors
                    ${mediaType === type.value 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  onClick={() => {
                    dispatch(setMediaType(type.value));
                    setPage(1); // Reset page on media type change
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* <InfiniteGrid
            items={items}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={fetchMoreData}
            page={page}
          /> */}
        </main>
      </div>
    </div>
  );
}
