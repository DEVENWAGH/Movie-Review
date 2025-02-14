import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPeople, resetState } from '../store/slices/peopleSlice';
import InfiniteGrid from '../components/shared/InfiniteGrid';
import PersonCard from '../components/PersonCard';
import Layout from '../components/shared/Layout';

export default function PeoplePage() {
  const dispatch = useAppDispatch();
  const { items, loading, currentPage, totalPages } = useAppSelector((state) => state.people);

  useEffect(() => {
    dispatch(resetState());
    dispatch(fetchPeople(1));
  }, [dispatch]);

  const fetchMoreData = () => {
    if (currentPage <= totalPages) {
      dispatch(fetchPeople(currentPage));
    }
  };

  return (
    <Layout>
      <main className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Popular People</h1>
          <p className="mt-2 text-gray-400">Discover trending actors and crew members in the entertainment industry</p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((person) => (
            <PersonCard key={person.id} {...person} />
          ))}
        </div>

        <InfiniteGrid
          items={items}
          loading={loading}
          hasMore={currentPage <= totalPages}
          onLoadMore={fetchMoreData}
        />
      </main>
    </Layout>
  );
}
