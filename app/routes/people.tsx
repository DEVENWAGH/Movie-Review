import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPeople, resetState } from '../store/slices/peopleSlice';
import PeopleInfiniteGrid from '../components/shared/PeopleInfiniteGrid';
import Layout from '../components/shared/Layout';

export default function PeoplePage() {
  const dispatch = useAppDispatch();
  const { items, loading, currentPage, totalPages } = useAppSelector((state) => state.people);

  useEffect(() => {
    dispatch(resetState());
    dispatch(fetchPeople(1));
  }, [dispatch]);

  const loadMore = () => {
    if (!loading && currentPage <= totalPages) {
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

        <PeopleInfiniteGrid
          items={items}
          loading={loading}
          hasMore={currentPage <= totalPages}
          onLoadMore={loadMore}
        />
      </main>
    </Layout>
  );
}
