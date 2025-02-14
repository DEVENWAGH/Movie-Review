import React from 'react';
import Discover from '../components/Discover';
import Layout from '../components/shared/Layout';

export default function Movie() {
  return (
    <Layout>
      <div className="bg-black rounded-xl p-6">
        <Discover mediaType="movie" title="Discover Movies" />
      </div>
    </Layout>
  );
}
