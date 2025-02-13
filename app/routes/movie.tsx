import React from 'react';
import TopNav from '../components/TopNav';
import { Sidebar } from '../components/Sidebar';
import Discover from '../components/Discover';

export default function Movie() {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1">
        <TopNav />
        <Discover mediaType="movie" title="Discover Movies" />
      </div>
    </div>
  );
}
