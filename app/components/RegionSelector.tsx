import { useState, useEffect } from 'react';
import { GlobeAltIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { detectRegion, setRegion } from '../store/slices/regionSlice';
import { countryNames } from '../utils/location';

export default function RegionSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { region, loading } = useAppSelector((state) => state.region);

  useEffect(() => {
    dispatch(detectRegion());
  }, [dispatch]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-400 rounded-lg hover:text-white hover:bg-[#1A2737]"
      >
        <GlobeAltIcon className="w-5 h-5" />
        <span>{loading ? 'Detecting...' : (countryNames[region] || region)}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 w-56 mt-2 overflow-y-auto bg-gray-800 rounded-lg shadow-xl max-h-96">
          {Object.entries(countryNames).map(([code, name]) => (
            <button
              key={code}
              className={`w-full px-4 py-2 text-left hover:bg-gray-700 ${
                code === region ? 'bg-gray-700 text-white' : 'text-gray-300'
              }`}
              onClick={() => {
                dispatch(setRegion(code));
                setIsOpen(false);
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
