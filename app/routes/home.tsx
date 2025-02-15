import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { fetchTrending } from "../store/slices/trendingSlice";
import Movie from "../movie/movie";
import { Sidebar } from "../components/Sidebar";
import TopNav from "../components/TopNav"; // Add this import

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTrending({ mediaType: 'all', timeWindow: 'day' }));
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-[#0A1625]">
      <div className="fixed top-0 left-0 h-full">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64"> {/* Add margin to offset fixed sidebar */}
        <div className="sticky top-0 z-50">
          <TopNav />
        </div>
        <div>
          <Movie />
        </div>
      </div>
    </div>
  );
}
