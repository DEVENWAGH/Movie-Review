import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchPopular,
  setMediaType,
  type MediaType,
} from "../store/slices/popularSlice";
import InfiniteGrid from "../components/shared/InfiniteGrid";
import Layout from "../components/shared/Layout";

export default function Popular() {
  const dispatch = useAppDispatch();
  const { items, mediaType, loading, currentPage, totalPages } = useAppSelector(
    (state) => state.popular
  );

  const mediaTypes = [
    { value: "movie" as MediaType, label: "Movies" },
    { value: "tv" as MediaType, label: "TV Shows" },
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
    <Layout>
      <div className="bg-black rounded-xl p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Popular</h1>
          <div className="flex gap-4">
            {mediaTypes.map((type) => (
              <button
                key={type.value}
                className={`px-4 py-2 rounded-full transition-colors
                  ${
                    mediaType === type.value
                      ? "bg-red-600 text-white"
                      : "bg-[#1A2737] text-gray-300 hover:bg-gray-700"
                  }`}
                onClick={() => dispatch(setMediaType(type.value))}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <InfiniteGrid
          items={items}
          loading={loading}
          hasMore={currentPage <= totalPages}
          onLoadMore={fetchMoreData}
          mediaType={mediaType}
        />
      </div>
    </Layout>
  );
}
