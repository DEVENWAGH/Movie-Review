import React from 'react';
import TopNav from '../components/TopNav';
import { Sidebar } from '../components/Sidebar';
import Discover from '../components/Discover';
import Layout from '../components/shared/Layout';  // Updated path

export default function TV() {
  return (
    <Layout>
      <div className="bg-black rounded-xl p-6">
        <Discover mediaType="tv" title="Discover TV Shows" />
      </div>
    </Layout>
  );
}
