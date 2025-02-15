import Header from "../components/Header";
import Slider from "../components/Slider";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchWallpaper } from "../store/slices/movieSlice";
import { fetchTrending } from "../store/slices/trendingSlice";
import { useNavigate } from "react-router";

// Add interface for wallpaper type
interface WallpaperData {
  id: string;
  media_type?: string;
  backdrop_path: string;
  title?: string;
  name?: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
}

export function Movie() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { wallpaper } = useAppSelector((state) => state.movie);
  const { items: trendingItems, mediaType, timeWindow } = useAppSelector((state) => state.trending);

  useEffect(() => {
    dispatch(fetchWallpaper());
    dispatch(fetchTrending({ mediaType, timeWindow, page: 1 }));
  }, [dispatch, mediaType, timeWindow]);

  const handleBannerClick = () => {
    if (wallpaper && typeof wallpaper === 'object') {
      const typedWallpaper = wallpaper as WallpaperData;
      const mediaType = typedWallpaper.media_type ?? 'movie';
      navigate(`/details/${mediaType}/${typedWallpaper.id}`);
    }
  };

  return (
    <div className="bg-[#0A1625]">
      <button
        onClick={handleBannerClick}
        onKeyDown={(e) => e.key === 'Enter' && handleBannerClick()}
        className="w-full text-left cursor-pointer"
        aria-label="View details"
      >
        <Header data={wallpaper} />
      </button>
      
      <main className="container px-4 py-8 mx-auto">
        <Slider title="Trending" items={trendingItems ?? []} />
      </main>
    </div>
  );
}

export default Movie;