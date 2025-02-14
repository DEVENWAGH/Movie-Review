import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "../Card";

interface InfiniteGridProps {
  items: any[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  mediaType?: string;
}

export default function InfiniteGrid({
  items,
  loading,
  hasMore,
  onLoadMore,
  mediaType,
}: Readonly<InfiniteGridProps>) {
  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <InfiniteScroll
        dataLength={items.length}
        next={onLoadMore}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        }
        endMessage={
          items.length > 0 && (
            <p className="text-center text-gray-500 py-4">
              <b>You have seen it all!</b>
            </p>
          )
        }
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 -mx-4"
      >
        {items.map((item) => (
          <div key={item.id} className="relative">
            <Card {...item} mediaType={mediaType || item.media_type} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
