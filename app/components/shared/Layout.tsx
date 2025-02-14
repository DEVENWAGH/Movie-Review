import React from 'react';
import TopNav from '../TopNav';
import { Sidebar } from '../Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<LayoutProps>) {
  return (
    <div className="flex min-h-screen bg-gray-900 relative">
      <div className="fixed top-0 left-0 h-full z-40">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64">
        <div className="sticky top-0 z-50 bg-gray-900">
          <TopNav />
        </div>
        <main className="p-8 relative z-30">
          {children}
        </main>
      </div>
    </div>
  );
}
