import { useState } from 'react';
import { ChevronDownIcon, LanguageIcon } from '@heroicons/react/24/outline';

interface TranslationsListProps {
  translations: any[];
}

export default function TranslationsList({ translations }: Readonly<TranslationsListProps>) {
  const [isOpen, setIsOpen] = useState(false);

  if (!translations?.length) return null;

  return (
    <div className="inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors"
      >
        <LanguageIcon className="w-5 h-5" />
        <span>{translations.length} Languages</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 mx-4 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-xl z-20 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Available Languages</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {translations.map((trans) => (
              <div
                key={trans.iso_639_1}
                className="px-3 py-2 bg-gray-700/50 rounded text-sm text-gray-300 hover:bg-gray-600/50"
              >
                {trans.english_name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
