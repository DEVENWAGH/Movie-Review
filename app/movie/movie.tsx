import TopNav from "../components/TopNav";
import Header from "../components/Header";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchWallpaper } from "../store/slices/movieSlice";

export function Movie() {
  const dispatch = useAppDispatch();
  const { wallpaper, loading } = useAppSelector((state) => state.movie);

  useEffect(() => {
    dispatch(fetchWallpaper());
  }, [dispatch]);

  return (
    <div>
      <TopNav />
      <Header data={wallpaper} />
    </div>
  );
}

export default Movie;