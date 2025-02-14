import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PersonCard from "../PersonCard";

interface PeopleInfiniteGridProps {
  items: any[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function PeopleInfiniteGrid({
  items,
  loading,
  hasMore,
  onLoadMore,
}: Readonly<PeopleInfiniteGridProps>) {
  // Show loading spinner when initially loading
  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // Filter out invalid items before rendering
  const validItems = items.filter(item => 
    item.profile_path && 
    item.name && 
    item.known_for_department &&
    item.known_for?.length > 0
  );

  return (
    <InfiniteScroll
      dataLength={validItems.length}
      next={onLoadMore}
      hasMore={hasMore}
      loader={
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      }
      endMessage={
        validItems.length > 0 && (
          <p className="text-center text-gray-500 py-4">
            <b>You have seen it all!</b>
          </p>
        )
      }
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
    >
      {validItems.map((person) => (
        <PersonCard key={person.id} {...person} />
      ))}
    </InfiniteScroll>
  );
}
