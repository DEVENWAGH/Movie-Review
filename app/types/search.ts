export interface SearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  name?: string;
  title?: string;
  original_name?: string;
  original_title?: string;
  profile_path?: string;
  poster_path?: string;
  overview?: string;
  known_for_department?: string; // For person type
}

export interface SearchResponse {
  page: number;
  results: SearchResult[];
  total_pages: number;
  total_results: number;
}
