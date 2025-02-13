import TopNav from "../components/TopNav";
import Header from "../components/Header";
import Slider from "../components/Slider";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchWallpaper } from "../store/slices/movieSlice";
import { fetchTrending } from "../store/slices/trendingSlice";

export function Movie() {
  const dispatch = useAppDispatch();
  const { wallpaper } = useAppSelector((state) => state.movie);
  const { items: trendingItems, mediaType, timeWindow } = useAppSelector((state) => state.trending);

  useEffect(() => {
    dispatch(fetchWallpaper());
    dispatch(fetchTrending({ mediaType, timeWindow, page: 1 }));
  }, [dispatch, mediaType, timeWindow]);

  return (
    <div>
      <TopNav />
      <Header data={wallpaper} />
      <main className="container mx-auto px-4">
        <Slider title="Trending" items={trendingItems || []} />
      </main>
    </div>
  );
}

export default Movie;