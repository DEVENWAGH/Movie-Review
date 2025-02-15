import React from 'react';
import TopNav from '../TopNav';
import { Sidebar } from '../Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<LayoutProps>) {
  return (
    <div className="flex min-h-screen bg-[#0A1625] relative">
      <div className="fixed top-0 left-0 z-40 h-full">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64">
        <div className="sticky top-0 z-50 bg-[#0A1625] border-b border-gray-800">
          <TopNav />
        </div>
        <main className="relative z-30 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
