import React, { useEffect, useState } from 'react';
import TopNav from '../TopNav';
import { Sidebar } from '../Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<LayoutProps>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until client-side hydration is complete
  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen bg-[#0A1625]" suppressHydrationWarning>
      <div className="fixed top-0 left-0 z-40 h-full">
        <Sidebar />
      </div>
      <div className="relative flex-1 w-full ml-64">
        <div className="sticky top-0 z-50 w-full bg-[#0A1625] border-b border-gray-800">
          <TopNav />
        </div>
        <div className="relative w-full">
          <main className="relative z-30 w-full p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
