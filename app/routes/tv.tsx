import React from 'react';
import TopNav from '../components/TopNav';
import { Sidebar } from '../components/Sidebar';
import Discover from '../components/Discover';

export default function TV() {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1">
        <TopNav />
        <Discover mediaType="tv" title="Discover TV Shows" />
      </div>
    </div>
  );
}
