import { useAppSelector } from '../store/hooks';
import { countryNames } from '../utils/location';

interface WatchProvidersProps {
  providers: any;
}

export default function WatchProviders({ providers }: Readonly<WatchProvidersProps>) {
  const { region } = useAppSelector((state) => state.region);

  if (!providers || Object.keys(providers).length === 0) {
    return null;
  }

  const currentProviders = providers[region];

  const providerTypes = {
    flatrate: 'Stream',
    free: 'Free',
    ads: 'Free with Ads',
    rent: 'Rent',
    buy: 'Buy',
  };

  if (!currentProviders) {
    return (
      <div className="text-gray-400">
        No streaming information available for {countryNames[region] || region}.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(Object.keys(providerTypes) as Array<keyof typeof providerTypes>).map((type) => {
        if (!currentProviders?.[type]) return null;
        
        return (
          <div key={type}>
            <h4 className="text-gray-400 text-sm font-medium mb-3">
              {providerTypes[type]}
            </h4>
            <div className="flex flex-wrap gap-3">
              {currentProviders[type].map((provider: any) => (
                <div
                  key={provider.provider_id}
                  className="group relative"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                    alt={provider.provider_name}
                    className="w-12 h-12 rounded-lg transition-transform group-hover:scale-105"
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    {provider.provider_name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
