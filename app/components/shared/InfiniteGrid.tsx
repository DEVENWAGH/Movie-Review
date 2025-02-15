import React from "react";
import { motion } from "motion/react";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "../Card";

interface InfiniteGridProps {
  items: any[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  mediaType?: string;
  showFullDate?: boolean;
}

export default function InfiniteGrid({
  items,
  loading,
  hasMore,
  onLoadMore,
  mediaType,
  showFullDate
}: Readonly<InfiniteGridProps>) {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 15,
        mass: 0.8
      }
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-white rounded-full animate-spin"></div>
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
          <div className="flex items-center justify-center py-4">
            <div className="w-8 h-8 border-b-2 border-white rounded-full animate-spin"></div>
          </div>
        }
        endMessage={
          items.length > 0 && (
            <p className="py-4 text-center text-gray-500">
              <b>You have seen it all!</b>
            </p>
          )
        }
        className="grid grid-cols-2 gap-6 -mx-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 scrollbar-hide"
        style={{ overflow: 'hidden' }}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ 
              once: true, 
              margin: "-50px",
              amount: 0.1 
            }}
            transition={{
              duration: 0.7,
              delay: Math.min(0.1 * (index % 3), 0.2),
              ease: [0.21, 0.45, 0.32, 0.9]
            }}
            className="relative"
          >
            <Card 
              {...item} 
              mediaType={mediaType ?? item.media_type}
              showFullDate={showFullDate}
            />
          </motion.div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
