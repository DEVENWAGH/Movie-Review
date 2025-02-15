// ...existing imports...

export const getUserRatings = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/account/${import.meta.env.VITE_TMDB_ACCOUNT_ID}/rated/movies?language=en-US&sort_by=created_at.desc`,
    {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch user ratings');
  }

  const data = await response.json();
  return data.results || [];
};
