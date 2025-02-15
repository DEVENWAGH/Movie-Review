import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("trending", "routes/trending.tsx"),
  route("popular", "routes/popular.tsx"),
  route("discover/movie", "routes/movie.tsx"),
  route("discover/tv", "routes/tv.tsx"),
  route("watchlist", "routes/watchlist.tsx"),
  route("people", "routes/people.tsx"),
  route("details/:mediaType/:id", "routes/details.tsx"),
] satisfies RouteConfig;
