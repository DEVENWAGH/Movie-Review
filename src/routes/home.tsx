import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks"; 
import { fetchTrending } from "../store/slices/trendingSlice"; 
import TopNav from "../components/TopNav"; 
import { Sidebar } from "../components/Sidebar"; 
import Discover from "../components/Discover";

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTrending({ mediaType: "all", timeWindow: "day" }));
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-[#0A1625]">
      <div className="fixed top-0 left-0 h-full">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64">
        <div className="sticky top-0 z-50">
          <TopNav />
        </div>
        <div className="container px-4 mx-auto">
          <Discover mediaType="movie" title="Discover Movies" />
        </div>
      </div>
    </div>
  );
}
