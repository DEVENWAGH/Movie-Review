import React from 'react';
import { Link } from 'react-router';

interface PersonCardProps {
  id: number;
  profile_path: string | null;
  name: string;
  known_for_department: string;
  known_for: Array<{
    title?: string;
    name?: string;
  }>;
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER_IMAGE = '/logo.svg';
export default function PersonCard({ id, profile_path, name, known_for_department, known_for }: Readonly<PersonCardProps>) {
  const imageUrl = profile_path
    ? `${IMAGE_BASE_URL}${profile_path}`
    : PLACEHOLDER_IMAGE;

  return (
    <Link to={`/people/${id}`}>
      <div className="bg-[#1A2737] rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200">
        <div className="aspect-[2/3] relative">
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = PLACEHOLDER_IMAGE;
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="mb-1 text-lg font-semibold text-white">{name}</h3>
          <p className="mb-2 text-sm text-gray-400">{known_for_department}</p>
          <p className="text-sm text-gray-500">
            Known for: {known_for.map(item => item.title || item.name).slice(0, 2).join(', ')}
          </p>
        </div>
      </div>
    </Link>
  );
}
