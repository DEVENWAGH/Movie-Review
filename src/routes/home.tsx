import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks"; 
import { fetchTrending } from "../store/slices/trendingSlice"; 
import TopNav from "../components/TopNav"; 
import { Sidebar } from "../components/Sidebar"; 
import Header from "../components/Header";
import Slider from "../components/Slider";
import { fetchFeatured } from "../store/slices/featuredSlice";
import { fetchDiscover } from "../store/slices/discoverSlice";

export default function Home() {
  const dispatch = useAppDispatch();
  const { item: featuredItem, loading: featuredLoading } = useAppSelector((state) => state.featured);
  const trendingItems = useAppSelector(state => state.trending.items);
  const popularMovies = useAppSelector(state => state.discover.items);

  useEffect(() => {
    // Fetch featured content for the hero banner
    dispatch(fetchFeatured());
    
    // Fetch trending content for first slider
    dispatch(fetchTrending({ mediaType: "all", timeWindow: "day" }));
    
    // Fetch popular movies for second slider
    dispatch(fetchDiscover({ 
      mediaType: "movie", 
      page: 1, 
      sortBy: "popularity.desc",
      category: "now_playing" 
    }));
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
        
        {/* Hero Banner using Header component */}
        {featuredItem && <Header data={featuredItem} />}
        {featuredLoading && (
          <div className="relative w-full h-[80vh] bg-gray-900 animate-pulse"></div>
        )}
        
        <div className="container px-4 mx-auto mt-6">
          {/* Trending Slider */}
          <div className="mb-8">
            <Slider 
              title="Trending Now" 
              items={trendingItems} 
              containerStyle="bg-black/30 hover:bg-black/50"
            />
          </div>
          
          {/* Now Playing Movies Slider */}
          <div className="mb-8">
            <Slider 
              title="Now Playing in Theaters" 
              items={popularMovies}
              containerStyle="bg-black/30 hover:bg-black/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
