import React from 'react';
import Discover from '../components/Discover';
import Layout from '../components/shared/Layout';  // Updated path

export default function TV() {
  return (
    <Layout>
      <div className="p-6 bg-black rounded-xl">
        <Discover mediaType="tv" title="Discover TV Shows" />
      </div>
    </Layout>
  );
}
