import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPeopleDetails, resetState } from '../../store/slices/peopleDetailsSlice';
import { ArrowLeftIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import CastingMoviesSlider from '../../components/CastingMoviesSlider';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const SOCIAL_LINKS = {
  facebook: 'https://facebook.com',
  twitter: 'https://x.com',
  instagram: 'https://instagram.com',
  homepage: ''
};

const calculateAge = (birthDate: string, deathDate?: string) => {
  const birth = new Date(birthDate);
  const end = deathDate ? new Date(deathDate) : new Date();
  const age = end.getFullYear() - birth.getFullYear();
  return age;
};

export default function PeopleDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { details, credits, loading, error } = useAppSelector((state) => state.peopleDetails);

  const [creditFilter, setCreditFilter] = React.useState('all');

  useEffect(() => {
    if (id) {
      dispatch(resetState());
      dispatch(fetchPeopleDetails(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-b-2 border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="p-8 text-center text-red-500">
        {error || 'Failed to load person details'}
      </div>
    );
  }

  const knownFor = credits?.cast 
    ? [...credits.cast].sort((a: any, b: any) => b.popularity - a.popularity).slice(0, 20)
    : [];

  const movieCredits = credits?.cast
    ? [...credits.cast]
        .sort((a, b) => new Date(b.release_date || b.first_air_date || '').getTime() - 
                        new Date(a.release_date || a.first_air_date || '').getTime())
        .filter(work => work.poster_path)
    : [];

  return (
    <div className="min-h-screen bg-[#0A1625]">
      <button 
        onClick={() => navigate(-1)}
        className="fixed z-50 p-2 transition-colors rounded-full top-4 left-4 bg-gray-800/80 hover:bg-gray-700"
      >
        <ArrowLeftIcon className="w-6 h-6 text-white" />
      </button>

      <div className="p-4 md:p-8">
        <div className="flex flex-col gap-8 mx-auto max-w-7xl md:flex-row">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <img
              src={`${IMAGE_BASE_URL}${details.profile_path}`}
              alt={details.name}
              className="w-full rounded-lg shadow-lg"
            />
            
            {/* Social Media Links */}
            {details.external_ids && (
              <div className="flex justify-center gap-6 mt-4">
                {details.homepage && (
                  <a href={details.homepage}
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gray-400 transition-colors hover:text-white"
                     aria-label="Official Website">
                    <GlobeAltIcon className="w-6 h-6" />
                  </a>
                )}
                {details.external_ids.facebook_id && (
                  <a href={`${SOCIAL_LINKS.facebook}/${details.external_ids.facebook_id}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gray-400 transition-colors hover:text-white"
                     aria-label="Facebook Profile">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>
                    </svg>
                  </a>
                )}
                {details.external_ids.twitter_id && (
                  <a href={`${SOCIAL_LINKS.twitter}/${details.external_ids.twitter_id}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gray-400 transition-colors hover:text-white"
                     aria-label="X (Twitter) Profile">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                {details.external_ids.instagram_id && (
                  <a href={`${SOCIAL_LINKS.instagram}/${details.external_ids.instagram_id}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gray-400 transition-colors hover:text-white"
                     aria-label="Instagram Profile">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.982c2.937 0 3.285.011 4.445.064 1.072.049 1.655.228 2.042.379.514.2.88.437 1.265.822.385.385.622.751.822 1.265.151.387.33.97.379 2.042.053 1.16.064 1.508.064 4.445 0 2.937-.011 3.285-.064 4.445-.049 1.072-.228 1.655-.379 2.042-.2.514-.437.88-.822 1.265-.385.385-.751.622-1.265.822-.387.151-.97.33-2.042.379-1.16.053-1.508.064-4.445.064-2.937 0-3.285-.011-4.445-.064-1.072-.049-1.655-.228-2.042-.379-.514-.2-.88-.437-1.265-.822-.385-.385-.622-.751-.822-1.265-.151-.387-.33-.97-.379-2.042-.053-1.16-.064-1.508-.064-4.445 0-2.937.011-3.285.064-4.445.049-1.072.228-1.655.379-2.042.2-.514.437-.88.822-1.265.385-.385.751-.622 1.265-.822.387-.151.97-.33 2.042-.379 1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066-1.171.054-1.97.24-2.67.512-.724.281-1.337.656-1.949 1.268-.612.612-.987 1.225-1.268 1.949-.272.7-.458 1.499-.512 2.67C1.013 8.638 1 9.013 1 12s.013 3.362.066 4.535c.054 1.171.24 1.97.512 2.67.281.724.656 1.337 1.268 1.949.612.612 1.225.987 1.949 1.268.7.272 1.499.458 2.67.512C8.638 22.987 9.013 23 12 23s3.362-.013 4.535-.066c1.171-.054 1.97-.24 2.67-.512.724-.281 1.337-.656 1.949-1.268.612-.612.987-1.225 1.268-1.949.272-.7.458-1.499.512-2.67.053-1.173.066-1.548.066-4.535s-.013-3.362-.066-4.535c-.054-1.171-.24-1.97-.512-2.67-.281-.724-.656-1.337-1.268-1.949-.612-.612-1.225-.987-1.949-1.268-.7-.272-1.499-.458-2.67-.512C15.362 1.013 14.987 1 12 1zm0 5.351c-3.121 0-5.649 2.528-5.649 5.649 0 3.121 2.528 5.649 5.649 5.649 3.121 0 5.649-2.528 5.649-5.649 0-3.121-2.528-5.649-5.649-5.649zm0 9.316c-2.026 0-3.667-1.641-3.667-3.667S9.974 8.333 12 8.333s3.667 1.641 3.667 3.667-1.641 3.667-3.667 3.667zm7.192-9.539c0 .729-.593 1.322-1.322 1.322-.729 0-1.322-.593-1.322-1.322 0-.729.593-1.322 1.322-1.322.729 0 1.322.593 1.322 1.322z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
          
          <div className="w-full md:w-2/3 lg:w-3/4">
            <h1 className="mb-4 text-4xl font-bold text-white">{details.name}</h1>
            
            {details.also_known_as?.length > 0 && (
              <p className="mb-2 text-gray-400">
                Also Known As: {details.also_known_as.join(', ')}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              {details.birthday && (
                <div>
                  <h3 className="font-semibold text-white">Birthday</h3>
                  <p className="text-gray-400">
                    {new Date(details.birthday).toLocaleDateString()}
                    {!details.deathday && (
                      <span className="ml-2">
                        (Age: {calculateAge(details.birthday)})
                      </span>
                    )}
                  </p>
                </div>
              )}
              
              {details.deathday && (
                <div>
                  <h3 className="font-semibold text-white">Died</h3>
                  <p className="text-gray-400">
                    {new Date(details.deathday).toLocaleDateString()}
                    <span className="ml-2">
                      (Age: {calculateAge(details.birthday, details.deathday)})
                    </span>
                  </p>
                </div>
              )}

              {!details.deathday && (
                <div>
                  <h3 className="font-semibold text-white">Status</h3>
                  <p className="text-green-400">Alive</p>
                </div>
              )}
              
              {details.place_of_birth && (
                <div>
                  <h3 className="font-semibold text-white">Place of Birth</h3>
                  <p className="text-gray-400">{details.place_of_birth}</p>
                </div>
              )}
              
              {details.known_for_department && (
                <div>
                  <h3 className="font-semibold text-white">Known For</h3>
                  <p className="text-gray-400">{details.known_for_department}</p>
                </div>
              )}
            </div>
            
            {details.biography && (
              <div className="mt-4">
                <h2 className="mb-2 text-xl font-semibold text-white">Biography</h2>
                <p className="text-gray-400">{details.biography}</p>
              </div>
            )}
          </div>
        </div>

        {/* Acting Credits section */}
        {movieCredits.length > 0 && (
          <div className="mx-auto mt-8 max-w-7xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Acting Credits</h2>
              <select
                value={creditFilter}
                onChange={(e) => setCreditFilter(e.target.value)}
                className="px-3 py-2 text-sm text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
              </select>
            </div>
            <CastingMoviesSlider 
              items={movieCredits.filter(credit => 
                creditFilter === 'all' || credit.media_type === creditFilter
              )} 
            />
          </div>
        )}

        {/* Known For section - now at the bottom */}
        <div className="mx-auto mt-8 max-w-7xl">
          <h2 className="mb-6 text-2xl font-bold text-white">Known For</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {knownFor.filter(work => work.poster_path).map((work) => (
              <div key={work.id} 
                   className="flex gap-4 p-4 transition-colors bg-[#1A2737] rounded-lg hover:bg-[#243548] min-h-[120px]">
                <img
                  src={`${IMAGE_BASE_URL}/w92${work.poster_path}`}
                  alt={work.title || work.name}
                  className="object-cover w-16 h-24 rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <h3 className="font-medium text-white">
                      {work.title || work.name}
                    </h3>
                    {work.character && (
                      <p className="text-sm text-gray-400">
                        as {work.character}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {work.release_date?.split('-')[0] || work.first_air_date?.split('-')[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
